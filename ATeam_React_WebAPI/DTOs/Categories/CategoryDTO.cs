using System.ComponentModel.DataAnnotations;

namespace ATeam_React_WebAPI.DTOs.Categories
{
  public class FoodCategoryDTO
  {
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
  }

  public class CategoryCreateDTO
  {
    [Required(ErrorMessage = "Category name is required")]
    [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters")]
    public required string CategoryName { get; set; }
  }
}