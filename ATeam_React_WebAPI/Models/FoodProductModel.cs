using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ATeam_React_WebApi.Models
{
	public class FoodProduct : BaseEntity
	{
		[Key]
		public int FoodProductId { get; set; }

		[Required]
		[StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters.")]
		[Display(Name = "Product Name")]
		public string ProductName { get; set; } = string.Empty;

		[Range(0, double.MaxValue, ErrorMessage = "Energy (kcal) must be a positive value.")]
		[Display(Name = "Energy (kcal)")]
		public decimal EnergyKcal { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Fat must be a positive value.")]
		public decimal Fat { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Carbohydrates must be a positive value.")]
		public decimal Carbohydrates { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Protein must be a positive value.")]
		public decimal Protein { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Fiber must be a positive value.")]
		public decimal Fiber { get; set; }

		[Range(0, double.MaxValue, ErrorMessage = "Salt must be a positive value.")]
		public decimal Salt { get; set; }

		public bool NokkelhullQualified { get; set; }

		// Foreign key for Category
		[Required]
		[Display(Name = "Category")]
		public int FoodCategoryId { get; set; }  // Match the primary key name

		[ForeignKey("FoodCategoryId")]
		public virtual FoodCategory? FoodCategory { get; set; }

		// Foreign key for User
		[Required]
		[Display(Name = "Created By")]
		[MaxLength(450)]
		public string CreatedById { get; set; } = string.Empty;

		[ForeignKey("CreatedById")]
		public virtual IdentityUser? CreatedBy { get; set; }
	}
}