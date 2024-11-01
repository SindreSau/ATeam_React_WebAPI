using System.ComponentModel.DataAnnotations;

namespace ATeam_React_WebApi.Models
{
  public class FoodCategory : BaseEntity
  {
    [Key]
    public int FoodCategoryId { get; set; }

    [Required]
    [Display(Name = "Category")]
    [StringLength(100)]
    public string CategoryName { get; set; } = string.Empty;

    // Navigation property - One to many relationship with FoodProduct
    public virtual ICollection<FoodProduct> FoodProducts { get; set; } = new List<FoodProduct>();
  }
}