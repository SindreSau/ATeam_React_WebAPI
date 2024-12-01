using System.ComponentModel.DataAnnotations;


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
    public int FoodCategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    // User info - needed for Admin, can be hidden in Vendor view in Front-end
    public string CreatedByUsername { get; set; } = string.Empty;

  }

  // DTO for Creating/Updating Products
  public class FoodProductCreateUpdateDTO
  {
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters")]
    public string ProductName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Energy value is required")]
    [Range(0, 1000, ErrorMessage = "Energy must be between 0 and 1000 kcal")]
    public decimal EnergyKcal { get; set; }

    [Required(ErrorMessage = "Fat content is required")]
    [Range(0, 100, ErrorMessage = "Fat must be between 0 and 100g")]
    public decimal Fat { get; set; }

    [Required(ErrorMessage = "Carbohydrate content is required")]
    [Range(0, 100, ErrorMessage = "Carbohydrates must be between 0 and 100g")]
    public decimal Carbohydrates { get; set; }

    [Required(ErrorMessage = "Protein content is required")]
    [Range(0, 100, ErrorMessage = "Protein must be between 0 and 100g")]
    public decimal Protein { get; set; }

    [Required(ErrorMessage = "Fiber content is required")]
    [Range(0, 100, ErrorMessage = "Fiber must be between 0 and 100g")]
    public decimal Fiber { get; set; }

    [Required(ErrorMessage = "Salt content is required")]
    [Range(0, 100, ErrorMessage = "Salt must be between 0 and 100g")]
    public decimal Salt { get; set; }

    [Required(ErrorMessage = "Please select a category")]
    public int FoodCategoryId { get; set; }
  }
}