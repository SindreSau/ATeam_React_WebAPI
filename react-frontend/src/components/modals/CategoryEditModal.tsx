import { useState, useEffect } from "react";
import { FoodCategory } from "../../types/category";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { Button } from "../common/Button";

interface CategoryEditModalProps {
    category: FoodCategory;
    show: boolean;
    onClose: () => void;
    onSave: (updatedCategory: FoodCategory) => Promise<void>;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({category, show, onClose, onSave}) => {
    const [editedCategory, setEditedCategory] = useState<FoodCategory>(category);

    useEscapeKey(onClose);

    useEffect(() => {
        setEditedCategory(category);
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(editedCategory);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedCategory(prev => ({ ...prev, [name]: value }));
    };

    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div
                className="modal fade show"
                tabIndex={-1}
                style={{display: 'block'}}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Category</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}/>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="categoryName"
                                        value={editedCategory.categoryName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button onClick={onClose} className="btn btn-subtle">Cancel</Button>
                                <Button type="submit" className="btn btn-primary">Save Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};