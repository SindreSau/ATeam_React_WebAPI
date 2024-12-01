using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ATeam_React_WebAPI.Interfaces;
using ATeam_React_WebAPI.Models;
using ATeam_React_WebAPI.DTOs.Categories;
using ATeam_React_WebAPI.Repositories;

namespace ATeam_React_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly IFoodCategoryRepository _foodCategoryRepository;

    public CategoryController(IFoodCategoryRepository foodCategoryRepository)
    {
        _foodCategoryRepository = foodCategoryRepository;
    }

    // Helper method:
    private async Task<FoodCategory> CheckCategory(int categoryId)
    {
        var category = await _foodCategoryRepository.GetCategoryByIDAsync(categoryId) ??
                       throw new KeyNotFoundException($"Category with Id: {categoryId} not found");
        return category;
    }

    // === GET ALL ====
    // api/category
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FoodCategoryDTO>>> GetCategories()
    {
        var categories = await _foodCategoryRepository.GetAllCategoriesAsync();
        var categoryDto = categories.Select(c => new FoodCategoryDTO
        {
            CategoryId = c.FoodCategoryId,
            CategoryName = c.CategoryName,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });

        return Ok(categoryDto);
    }

    // === GET ONE ====
    // api/category/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<FoodCategoryDTO>> GetCategory(int id)
    {
        try
        {
            var category = await CheckCategory(id);

            var categoryDto = new FoodCategoryDTO
            {
                CategoryId = category.FoodCategoryId,
                CategoryName = category.CategoryName
            };

            return Ok(categoryDto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    // === CREATE ===
    // POST : api/category
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<FoodCategoryDTO>> CreateCategory([FromBody] CategoryCreateDTO createDTO)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Create category
        var category = new FoodCategory
        {
            CategoryName = createDTO.CategoryName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Save category
        await _foodCategoryRepository.AddCategoryAsync(category);

        // Map DTO
        var resultDto = new FoodCategoryDTO
        {
            CategoryId = category.FoodCategoryId,
            CategoryName = category.CategoryName
        };

        return CreatedAtAction(nameof(GetCategory), new { id = category.FoodCategoryId }, resultDto);
    }

    // === UPDATE ===
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<FoodCategoryDTO>> UpdateCategory(int id, [FromBody] CategoryCreateDTO updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // Check category exists and get
            var existingCategory = await CheckCategory(id);

            existingCategory.CategoryName = updateDto.CategoryName;
            existingCategory.UpdatedAt = DateTime.UtcNow;

            // Save change
            var updatedCategory = await _foodCategoryRepository.UpdateCategoryAsync(existingCategory);

            var resultDto = new FoodCategoryDTO
            {
                CategoryId = updatedCategory.FoodCategoryId,
                CategoryName = updatedCategory.CategoryName
            };

            // Return updated DTO
            return Ok(resultDto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    // === DELETE Category ===
    // DELETE : api/category/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [HttpPost("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _foodCategoryRepository.DeleteCategoryAsync(id);
            return Ok(new { message = "Category deleted successfully." });
        }
        catch (FoodCategoryRepository.CategoryInUseException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}