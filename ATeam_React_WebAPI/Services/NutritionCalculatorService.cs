using Serilog;

namespace ATeam_React_WebAPI.Services;

public static class NutritionCalculatorService
{
    // Public constants for transparency and reuse
    public const float MaxEnergyKcal = 40.0f;     // Maximum energy in kcal per 100g
    public const float MaxFat = 3.0f;             // Maximum fat in grams per 100g
    public const float MaxCarbohydrates = 40.0f;  // Maximum carbohydrates in grams per 100g
    public const float MinProtein = 3.0f;         // Minimum protein in grams per 100g
    public const float MinFiber = 6.0f;           // Minimum fiber in grams per 100g
    public const float MaxSalt = 1.0f;            // Maximum salt in grams per 100g

    /// <summary>
    /// Determines if a food product qualifies for the Nøkkelhull label based on its nutritional values.
    /// </summary>
    /// <param name="energyKcal">Energy content in kcal per 100g</param>
    /// <param name="protein">Protein content in grams per 100g</param>
    /// <param name="carbohydrates">Carbohydrates content in grams per 100g</param>
    /// <param name="fat">Fat content in grams per 100g</param>
    /// <param name="fiber">Fiber content in grams per 100g</param>
    /// <param name="salt">Salt content in grams per 100g</param>
    /// <returns>True if the product qualifies for Nøkkelhull, false otherwise</returns>
    public static bool IsNokkelhullQualified(
        float energyKcal,
        float protein,
        float carbohydrates,
        float fat,
        float fiber,
        float salt)
    {
        // Guard clauses for negative values
        if (energyKcal < 0 || protein < 0 || carbohydrates < 0 ||
            fat < 0 || fiber < 0 || salt < 0)
        {
            Log.Warning("Negative values are not allowed for Nøkkelhull qualification");
            return false;
        }

        // Check all criteria
        return energyKcal <= MaxEnergyKcal
               && fat <= MaxFat
               && carbohydrates <= MaxCarbohydrates
               && protein >= MinProtein
               && fiber >= MinFiber
               && salt <= MaxSalt;
    }
}