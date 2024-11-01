namespace ATeam_React_WebApi.Configuration;

public static class SessionConfig
{
    public static IServiceCollection AddSessionServices(this IServiceCollection services)
    {
        services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromDays(30);
            options.Cookie.HttpOnly = true;
            options.Cookie.IsEssential = true;
        });

        return services;
    }
}