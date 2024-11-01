using ATeam_React_WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ATeam_React_WebAPI.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    // Add new DbSet for each new model
    public DbSet<FoodCategory> FoodCategories { get; set; }
    public DbSet<FoodProduct> FoodProducts { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Set up on delete behavior for foreign keys
        builder.Entity<FoodProduct>()
            .HasOne(p => p.FoodCategory)
            .WithMany(c => c.FoodProducts)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<FoodProduct>()
            .HasOne(p => p.CreatedBy)
            .WithMany()
            .OnDelete(DeleteBehavior.Restrict);
    }
}