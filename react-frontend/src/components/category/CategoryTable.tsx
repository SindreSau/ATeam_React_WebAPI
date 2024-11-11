import {FoodCategory} from "../../types/category";

interface CategoryTableProps {
    categories: FoodCategory[];
}

export const CategoryTable = ({categories}: CategoryTableProps) => {
    console.log('Categories:', categories);

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
                            <button className="btn btn-sm btn-outline-danger">
                                <i className="fa fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};
