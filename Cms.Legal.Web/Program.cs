using AspNetCoreRateLimit;
using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.QueryData;
using Cms.Legal.Areas.SystemAreas;
using Cms.Legal.ModelAI.ServiceModelsAI;
using Cms.Legal.Web.Data;
using Cms.Legal.Web.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
// Add services to the container.
// ===== DATABASE =====
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

var connectlegal = config.GetConnectionString("LegalConnection");
builder.Services.AddDbContext<LegalDbContext>(options =>
    options.UseNpgsql(connectlegal, b => b.MigrationsAssembly("Cms.Legal.Web")));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// ===== IDENTITY =====
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.Lax;
});

// ===== AUTHENTICATION =====
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtBearer:Issuer"],
            ValidAudience = builder.Configuration["JwtBearer:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtBearer:Key"]))
        };
    })
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.LoginPath = "/login";
        options.LogoutPath = "/logout";
        options.AccessDeniedPath = "/AccessDenied";
    });

// ===== RATE LIMITING - Tối ưu cho 1M requests =====
builder.Services.AddMemoryCache();
builder.Services.AddRateLimiter(options =>
{
    // Per IP rate limit
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var clientIp = context.Connection.RemoteIpAddress?.ToString();

        // Lấy real IP từ Cloudflare
        if (context.Request.Headers.ContainsKey("CF-Connecting-IP"))
        {
            clientIp = context.Request.Headers["CF-Connecting-IP"].ToString();
        }
        else if (context.Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            clientIp = context.Request.Headers["X-Forwarded-For"].ToString().Split(',')[0].Trim();
        }

        return RateLimitPartition.GetSlidingWindowLimiter(clientIp ?? "unknown", _ =>
            new SlidingWindowRateLimiterOptions
            {
                PermitLimit = 20, // 20 requests
                Window = TimeSpan.FromMinutes(1), // per minute
                SegmentsPerWindow = 2,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 10
            });
    });

    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            error = "Too many requests",
            message = "Please try again later",
            retryAfter = 60
        }, cancellationToken: token);
    };
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/login";
    options.LogoutPath = "/logout";
    options.AccessDeniedPath = "/AccessDenied";
    options.ReturnUrlParameter = "returnUrl";
    options.SlidingExpiration = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
});

// ===== HTTP CLIENT FACTORY - Tối ưu connection pooling =====
//builder.Services.AddHttpClient("GPTClient", client =>
//{
//    client.BaseAddress = new Uri("https://api.openai.com");
//    client.Timeout = TimeSpan.FromMinutes(2);
//    client.DefaultRequestHeaders.ConnectionClose = false;
//})
//.ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
//{
//    PooledConnectionLifetime = TimeSpan.FromMinutes(10),
//    PooledConnectionIdleTimeout = TimeSpan.FromMinutes(5),
//    MaxConnectionsPerServer = 100,
//    EnableMultipleHttp2Connections = true
//});

// HTTP Client cho Gemini - Tối ưu cho upload file
builder.Services.AddHttpClient("GeminiClient", client =>
{
    client.Timeout = TimeSpan.FromMinutes(3); // Timeout 3 phút cho Cloudflare
    client.DefaultRequestHeaders.ConnectionClose = false;
})
.ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
{
    PooledConnectionLifetime = TimeSpan.FromMinutes(15),
    PooledConnectionIdleTimeout = TimeSpan.FromMinutes(10),
    MaxConnectionsPerServer = 200, // Tăng cao cho concurrent uploads
    EnableMultipleHttp2Connections = true,
    // Tối ưu cho Cloudflare
    ConnectTimeout = TimeSpan.FromSeconds(30),
    ResponseDrainTimeout = TimeSpan.FromSeconds(30)
});

// ===== CONTROLLERS =====
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<ClientInfoFilter>();
});

// ===== SERVICES =====
var priv = Path.Combine(builder.Environment.ContentRootPath, "secrets", "jwt_rsa_priv.pem");
var pub = Path.Combine(builder.Environment.ContentRootPath, "secrets", "jwt_rsa_pub.pem");

builder.Services.AddScoped<ClientInfoFilter>();
builder.Services.AddSingleton<SecureCookieCrypto>();
builder.Services.AddSingleton(new JwtService(priv, pub));
builder.Services.AddSingleton(new JwtServiceGuest(priv, pub));
builder.Services.AddSingleton<LLamaServiceAI>();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddScoped<AccountQuery>();
builder.Services.AddScoped<ChatAIQuery>();
builder.Services.AddScoped<AddressQuery>();
builder.Services.AddScoped<MenuQuery>();
builder.Services.AddScoped<LayoutQuery>();
builder.Services.AddScoped<LocationService>();
builder.Services.AddScoped<MockTrialQuery>();

// ===== RAZOR PAGES =====
builder.Services.AddRazorPages(options =>
{
    options.Conventions.AddAreaPageRoute("Identity", "/Account/Login", "login");
    options.Conventions.AddAreaPageRoute("Identity", "/Account/Logout", "logout");
    options.Conventions.AddAreaPageRoute("Identity", "/Account/Register", "register");
    options.Conventions.AddAreaPageRoute("Identity", "/Account/AccessDenied", "accessDenied");
});

// ===== KESTREL - Tối ưu cho Cloudflare =====
builder.WebHost.ConfigureKestrel(options =>
{
    // Giới hạn 5MB cho file upload (Cloudflare free plan limit 100MB)
    options.Limits.MaxRequestBodySize = 5242880; // 5MB strict

    // Tăng timeout cho Cloudflare (Cloudflare timeout 100s)
    options.Limits.KeepAliveTimeout = TimeSpan.FromSeconds(90);
    options.Limits.RequestHeadersTimeout = TimeSpan.FromSeconds(90);

    // Tối ưu cho concurrent connections
    options.Limits.MaxConcurrentConnections = 10000;
    options.Limits.MaxConcurrentUpgradedConnections = 10000;

    // Stream optimization
    options.Limits.MinRequestBodyDataRate = new Microsoft.AspNetCore.Server.Kestrel.Core.MinDataRate(
        bytesPerSecond: 100, gracePeriod: TimeSpan.FromSeconds(10));
    options.Limits.MinResponseDataRate = new Microsoft.AspNetCore.Server.Kestrel.Core.MinDataRate(
        bytesPerSecond: 100, gracePeriod: TimeSpan.FromSeconds(10));
});

// ===== RESPONSE COMPRESSION - Giảm bandwidth =====
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();
});

builder.Services.Configure<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Fastest;
});

Environment.SetEnvironmentVariable("ASPNETCORE_BROWSER_REFRESH_ENABLED", "false");

// ===== FORWARDED HEADERS - Cloudflare support =====
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                               ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();

    // Trust Cloudflare IPs
    options.ForwardLimit = 2;
});

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    // Gọi service ra để Constructor chạy ngay lập tức
    //var aiService = scope.ServiceProvider.GetRequiredService<LLamaServiceAI>();
}
// ===== MIDDLEWARE PIPELINE =====
app.UseForwardedHeaders();

// Response compression
app.UseResponseCompression();

// Rate limiter
//app.UseRateLimiter();

// Security headers - Tối ưu cho Cloudflare
app.Use(async (context, next) =>
{
    // Cloudflare đã handle một số headers, chỉ thêm những gì cần
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Add("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    // Remove server info
    context.Response.Headers.Remove("Server");
    context.Response.Headers.Remove("X-Powered-By");

    await next.Invoke();
});

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseStatusCodePagesWithRedirects("/Error/NotFound");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// ===== ROUTES =====
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "page",
    pattern: "{slug}/{category}/{id?}",
    defaults: new { controller = "Home", action = "Page" });

app.MapRazorPages();

app.Run();