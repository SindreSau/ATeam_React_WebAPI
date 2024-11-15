import React, {memo} from "react";
import {FoodCategory} from "../../types/category";
import { Button } from "../common/Button";

interface CategoryTableProps {
    categories: FoodCategory[];
    onDelete?: (categoryId: number) => Promise<void> | void;
    isDeleting?: boolean;
    deletingCategoryId?: number;
}

export const CategoryTable = memo(({
    categories, 
    onDelete, 
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
        <div className="card">
        <div className="card-body">
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                    <tr key={category.categoryId}>
                        <td>{category.categoryId}</td>
                        <td>{category.categoryName}</td>
                        <td></td>
                        <td></td>
                        <td>
                            <a className="btn btn-sm btn-outline-secondary">
                                <i className="fa fa-pencil"></i> Edit
                            </a>
                            <Button variant="outline-danger"
                                    onClick={() => handleDelete(category)}
                                    disabled={isDeleting}
                                    aria-label={`Delete ${category.categoryName}`}>
        
                                {isDeleting ? (
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
        </div>
        </div>
    );
});
