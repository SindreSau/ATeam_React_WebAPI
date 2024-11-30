import React, {memo} from "react";
import {FoodCategory} from "../../types/category";
import {Button} from "../common/Button";

interface CategoryTableProps {
    categories: FoodCategory[];
    onDelete?: (categoryId: number) => Promise<void> | void;
    onEdit: (FoodCategory: FoodCategory) => void;
    isDeleting?: boolean;
    deletingCategoryId?: number;
}

export const CategoryTable = memo(({
                                       categories,
                                       onDelete,
                                       onEdit,
                                       isDeleting,
                                       deletingCategoryId
                                   }: CategoryTableProps) => {

    const handleDelete = (category: FoodCategory) => {
        if (onDelete) {
            onDelete(category.categoryId);
        }
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="card">
                <div className="card-body">
                    No categories found.
                </div>
            </div>
        );
    }

    return (
        // Categories Table
        <div className="table-responsive border rounded py-5 px-8">
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>CreatedAt</th>
                    <th>UpdatedAt</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category) => (
                    <tr key={category.categoryId}>
                        <td>{category.categoryId}</td>
                        <td>{category.categoryName}</td>
                        <td>{new Date(category.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}</td>
                        <td>{new Date(category.updatedAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}</td>
                        <td>
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={() => onEdit(category)}
                                aria-label={`Edit ${category.categoryName}`}>
                                <i className="fa fa-pencil me-1"></i>
                                Edit
                            </Button>
                            <Button variant="outline-danger"
                                    onClick={() => handleDelete(category)}
                                    disabled={isDeleting && deletingCategoryId === category.categoryId}
                                    aria-label={`Delete ${category.categoryName}`}>

                                {isDeleting && deletingCategoryId === category.categoryId ? (
                                    <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                    />
                                ) : (
                                    <i className="fa fa-trash me-1"></i>
                                )}
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
});
