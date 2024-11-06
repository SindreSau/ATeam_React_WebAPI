
namespace ATeam_React_WebAPI.DTOs.Common
{
  // Generic response class for Paginated Data
  public class PaginatedResponse<T>
  {
    // List of items
    public List<T> Items { get; set; } = new List<T>();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    // Helper properties for pagination UI:
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
  }

  // Parameters class that helps us handle pagination requests
  // Validates and standardizes pagination parameters from client requests = cleaner code
  public class PaginationParameters
  {
    // Max allowed pages for performance (Probably don't need to change for this app)
    private const int MaxPageSize = 50;
    // Defaults to 10
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;

    // Page size with validation to prevent exceeding MaxPageSize
    public int PageSize
    {
      get => _pageSize;
      set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    // Sorting
    public string OrderBy { get; set; } = "productid";
    // Filtering
    public bool? Nokkelhull { get; set; }
    public string? Search { get; set; }
  }
}
