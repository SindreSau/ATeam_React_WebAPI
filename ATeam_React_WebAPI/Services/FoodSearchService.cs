using ATeam_React_WebAPI.Models;

namespace ATeam_React_WebAPI.Services;

public interface IFoodSearchService
{
    IEnumerable<FoodProduct> Search(IEnumerable<FoodProduct> products, string searchQuery,
        double similarityThreshold = 30.0);
}

public class FoodSearchService : IFoodSearchService
{
    private const double ProductNameWeight = 1.0;
    private const double CategoryNameWeight = 0.8;
    private const double VendorNameWeight = 0.6;

    public IEnumerable<FoodProduct> Search(IEnumerable<FoodProduct> products, string searchQuery,
        double similarityThreshold = 30.0)
    {
        if (string.IsNullOrWhiteSpace(searchQuery))
        {
            return products;
        }

        var searchTerms = searchQuery.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Calculate relevance once for each product and store it
        var searchResults = products
            .Select(product => new
            {
                Product = product,
                ExactMatch = product.ProductName?.Equals(searchQuery, StringComparison.OrdinalIgnoreCase) ?? false,
                Relevance = CalculateRelevanceScore(product, searchTerms, similarityThreshold)
            })
            .Where(result => result.Relevance > similarityThreshold)
            .OrderByDescending(result => result.ExactMatch) // First order by exact matches
            .ThenByDescending(result => result.Relevance) // Then by relevance score
            .Select(result => result.Product)
            .ToList();

        return searchResults;
    }

    private double CalculateRelevanceScore(FoodProduct product, string[] searchTerms, double threshold)
    {
        // Normalize strings for comparison
        var productName = product.ProductName?.ToLower() ?? "";
        var categoryName = product.FoodCategory?.CategoryName?.ToLower() ?? "";
        var vendorName = product.CreatedBy?.UserName?.ToLower() ?? "";

        // ALL search terms must match with sufficient similarity
        return searchTerms.Min(term => // Changed from Max to Min to require all terms to match
        {
            if (term.Length <= 0) return 0;

            // Exact matches get highest priority
            if (productName.Contains(term, StringComparison.OrdinalIgnoreCase))
            {
                return 100;
            }

            if (categoryName.Contains(term, StringComparison.OrdinalIgnoreCase))
            {
                return 90;
            }

            if (vendorName.Contains(term, StringComparison.OrdinalIgnoreCase))
            {
                return 80;
            }

            double maxScore = 0;

            // Check product name words - look for partial matches too
            var productNameWords = productName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var word in productNameWords)
            {
                // For short search terms, be more lenient with partial matches
                if (term.Length <= 4 && word.Contains(term, StringComparison.OrdinalIgnoreCase))
                {
                    maxScore = Math.Max(maxScore, 95); // High score for partial matches of short terms
                }

                var similarity = CalculateSimilarity(term, word) * ProductNameWeight;
                maxScore = Math.Max(maxScore, similarity);
            }

            // Only continue checking other fields if we haven't found a good match
            if (maxScore < threshold)
            {
                // Check category words
                var categoryWords = categoryName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                foreach (var word in categoryWords)
                {
                    var similarity = CalculateSimilarity(term, word) * CategoryNameWeight;
                    maxScore = Math.Max(maxScore, similarity);
                }

                // Check vendor words
                var vendorWords = vendorName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                foreach (var word in vendorWords)
                {
                    var similarity = CalculateSimilarity(term, word) * VendorNameWeight;
                    maxScore = Math.Max(maxScore, similarity);
                }
            }

            return maxScore;
        });
    }

    private double CalculateSimilarity(string source, string target)
    {
        if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target))
            return 0;

        var distance = LevenshteinDistance(source, target);
        var maxLength = Math.Max(source.Length, target.Length);
        return (1.0 - ((double)distance / maxLength)) * 100;
    }

    private int LevenshteinDistance(string source, string target)
    {
        var matrix = new int[source.Length + 1, target.Length + 1];

        for (var i = 0; i <= source.Length; matrix[i, 0] = i++)
        {
        }

        for (var j = 0; j <= target.Length; matrix[0, j] = j++)
        {
        }

        for (var i = 1; i <= source.Length; i++)
        {
            for (var j = 1; j <= target.Length; j++)
            {
                var cost = (target[j - 1] == source[i - 1]) ? 0 : 1;
                matrix[i, j] = Math.Min(
                    Math.Min(matrix[i - 1, j] + 1, matrix[i, j - 1] + 1),
                    matrix[i - 1, j - 1] + cost);
            }
        }

        return matrix[source.Length, target.Length];
    }
}