using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.QueryData;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.SystemAreas
{
    public class ClientInfoFilter : IAsyncActionFilter
    {
        private readonly SecureCookieCrypto _crypto;
        private readonly AccountQuery _accountQuery;
        private readonly JwtServiceGuest _jwtService; 

        public ClientInfoFilter(SecureCookieCrypto crypto, AccountQuery accountQuery, JwtServiceGuest jwtService)
        {
            _crypto = crypto;
            _accountQuery = accountQuery;
            _jwtService = jwtService;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var http = context.HttpContext;
            string cookieName = "client_info";
            SessionContactViewModels? clientInfo = null;

            // 1. Check JWT authentication
            var isAuth = http.User?.Identity?.IsAuthenticated ?? false;

            // 2. Try read cookie
            string? encrypted = http.Request.Cookies[cookieName];
            if (!string.IsNullOrEmpty(encrypted))
            {
                try
                {
                    var json = _crypto.Decrypt(encrypted);
                    clientInfo = JsonSerializer.Deserialize<SessionContactViewModels>(json);
                }
                catch { clientInfo = null; }
            }

            // 3. Determine userId
            string? userId;
            if (isAuth)
            {
                userId = http.User.FindFirst("sub")?.Value;
            }
            else
            {
                // Guest: tạo guestId nếu chưa có
                if (clientInfo == null || string.IsNullOrEmpty(clientInfo.GuestId))
                {
                    var guestId = Guid.NewGuid().ToString();
                    clientInfo ??= new SessionContactViewModels();
                    clientInfo.GuestId = guestId;
                    var ip = context.HttpContext.Connection.RemoteIpAddress?.ToString();
                    var userAgent = context.HttpContext.Request.Headers["User-Agent"].ToString();
                    var uaParser = UAParser.Parser.GetDefault();
                    var ua = uaParser.Parse(userAgent);
                    var device = ua.Device.Family;
                    var browser = ua.Browser.Minor.ToString();
                    var guest = new GuestSessionViewModels()
                    {
                        AppName = browser,
                        IpUser = ip,
                        DeviceUser = device,
                        RoleUser = "Guest",
                        UserId = ConfigGeneral.CodeData("GOYE"),
                        NickName = "client-" + ip,
                    };
                    clientInfo.GuestSession = guest;
                    // Lưu cookie guest
                    var json = JsonSerializer.Serialize(clientInfo);
                    var enc = _crypto.Encrypt(json);
                    http.Response.Cookies.Append(cookieName, enc, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTimeOffset.UtcNow.AddHours(6)
                    });
                }
                userId = clientInfo.GuestId;
            }

            // 4. Nếu cookie null hoặc userId chưa tồn tại trong clientInfo → load DB
            if (userId == null)
            {
                clientInfo = await _accountQuery.GetSessionContact(userId);
                var ip = context.HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = context.HttpContext.Request.Headers["User-Agent"].ToString();
                var uaParser = UAParser.Parser.GetDefault();
                var ua = uaParser.Parse(userAgent);
                var device = ua.Device.Family;
                var browser = ua.Browser.Minor.ToString();
                var guest = new GuestSessionViewModels()
                {
                    AppName = browser,
                    IpUser = ip,
                    DeviceUser = device,
                    RoleUser = "Guest",
                    UserId = ConfigGeneral.CodeData("GOYE"),
                    NickName = "client-" + ip,
                };
                clientInfo.GuestSession = guest;
                // Lưu cookie
                var json = JsonSerializer.Serialize(clientInfo);
                var enc = _crypto.Encrypt(json);
                http.Response.Cookies.Append(cookieName, enc, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(6)
                });
            }
            if (clientInfo.GuestSession.IpUser == null) {
                var ip = context.HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = context.HttpContext.Request.Headers["User-Agent"].ToString();
                var uaParser = UAParser.Parser.GetDefault();
                var ua = uaParser.Parse(userAgent);
                var device = ua.Device.Family;
                var browser = ua.Browser.Minor.ToString();
                var guest = new GuestSessionViewModels()
                {
                    AppName = browser,
                    IpUser = ip,
                    DeviceUser = device,
                    RoleUser = "Guest",
                    UserId = ConfigGeneral.CodeData("GOYE"),
                    NickName = "client-" + ip,
                };
                clientInfo.GuestSession = guest;
                // Lưu cookie
                var json = JsonSerializer.Serialize(clientInfo);
                var enc = _crypto.Encrypt(json);
                http.Response.Cookies.Append(cookieName, enc, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(6)
                });
            }

            http.Items["ClientInfo"] = clientInfo;

            await next();
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}
