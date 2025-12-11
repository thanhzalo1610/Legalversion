using Cms.Legal.Areas.SystemAreas;
using System.Net;

namespace Cms.Legal.Web.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtService _jwtService;

        public JwtMiddleware(RequestDelegate next, JwtService jwtService)
        {
            _next = next;
            _jwtService = jwtService;
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token != null)
            {
                var principal = _jwtService.ValidateToken(token);
                if (principal != null)
                {
                    context.User = principal;
                }
                else
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await context.Response.WriteAsync("Invalid token");
                    return;
                }
            }
            await _next(context);
        }
    }
}
