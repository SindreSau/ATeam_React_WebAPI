using ATeam_React_WebAPI.Configuration;
using Microsoft.AspNetCore.Identity;
using ATeam_React_WebAPI.Data;
using ATeam_React_WebAPI.Middleware;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}Properties: {Properties:j}{NewLine}{Exception}")
    .WriteTo.File(
        outputTemplate:
        "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {Message:lj} | Method={RequestMethod} Path={RequestPath} Status={StatusCode} Elapsed={ElapsedMilliseconds}ms User={UserId} Client={ClientIP} Query={QueryString}{NewLine}",
        path: "logs/log-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30)
    .CreateLogger();

Log.Information("Starting web API application");

var builder = WebApplication.CreateBuilder(args);

// Set the urls for the web application
builder.WebHost.UseUrls("http://localhost:5000", "https://localhost:5001");

// Remove default logging providers and add Serilog
builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure services using extension methods from the Configuration folder
builder.Services
    .AddDatabaseServices(builder.Configuration)
    .AddIdentityServices();

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var context = services.GetRequiredService<ApplicationDbContext>();

        Log.Information("Seeding database...");

        await DbSeeder.SeedData(services, userManager, roleManager);

        if (app.Environment.IsDevelopment())
        {
            Log.Information("Development environment detected, seeding test data...");
            await DbSeeder.SeedTestVendorWithTestProducts(userManager, context);
        }

        Log.Information("Database seeding completed successfully");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while seeding the database");
        throw;
    }
}

// Configure the middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    Log.Information("Running in development mode");
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
    Log.Information("Running in production mode");
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<IdentityUser>(); // This maps all the Identity endpoints

app.UseRequestLogging();

app.MapControllers();

Log.Information("Web API application started successfully");
Log.Information("Web API listening on http://localhost:5000 and https://localhost:5001");
Log.Information("Access the Swagger UI at https://localhost:5001/swagger");

await app.RunAsync();