namespace ATeam_React_WebAPI.DTOs.Products
{
  public class FoodProductDTO
  {
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;

    // Nutritional info
    public decimal EnergyKcal { get; set; }
    public decimal Fat { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Protein { get; set; }
    public decimal Fiber { get; set; }
    public decimal Salt { get; set; }

    // Nokkelhull + Category
    public bool NokkelhullQualified { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    // User info - needed for Admin, can be hidden in Vendor view in Front-end
    public string CreatedByUsername { get; set; } = string.Empty;

  }
}