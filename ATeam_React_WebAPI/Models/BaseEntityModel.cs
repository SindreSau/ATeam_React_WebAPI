namespace ATeam_React_WebAPI.Models;

/**
 * Base class for all entities in the database.
 * Helps us add CreatedAt and UpdatedAt fields to all entities.
 */
public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}