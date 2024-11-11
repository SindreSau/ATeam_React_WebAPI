using System.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Serilog.Context;

namespace ATeam_React_WebAPI.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, UserManager<IdentityUser> userManager)
    {
        var sw = Stopwatch.StartNew();

        try
        {
            var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            using (LogContext.PushProperty("RequestMethod", context.Request.Method))
            using (LogContext.PushProperty("RequestPath", context.Request.Path))
            using (LogContext.PushProperty("QueryString", context.Request.QueryString.ToString()))
            using (LogContext.PushProperty("ClientIP", context.Connection.RemoteIpAddress?.ToString() ?? string.Empty))
            using (LogContext.PushProperty("UserAgent", context.Request.Headers.UserAgent.ToString()))
            using (LogContext.PushProperty("UserId", userId ?? "anonymous"))
            {
                await _next(context);

                sw.Stop();

                // Choose log level based on status code
                var statusCode = context.Response.StatusCode;
                var message = $"HTTP {context.Request.Method} {context.Request.Path} completed in {sw.ElapsedMilliseconds}ms with status code {statusCode}";

                switch (statusCode)
                {
                    case >= 500:
                        _logger.LogError(message);
                        break;
                    case >= 400:
                        _logger.LogWarning(message);
                        break;
                    default:
                        _logger.LogInformation(message);
                        break;
                }
            }
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex,
                "HTTP request failed in {ElapsedMilliseconds}ms",
                sw.ElapsedMilliseconds);
            throw;
        }
    }
}


// Extension method to easily add the middleware
public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<RequestLoggingMiddleware>();
    }
}