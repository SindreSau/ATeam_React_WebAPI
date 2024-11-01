using ATeam_React_WebApi.Data;
using ATeam_React_WebApi.Interfaces;
using ATeam_React_WebApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ATeam_React_WebApi.Configuration;

public static class DatabaseConfig
{
    public static IServiceCollection AddDatabaseServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IFoodProductRepository, FoodProductRepository>();
        services.AddScoped<IFoodCategoryRepository, FoodCategoryRepository>();

        return services;
    }
}