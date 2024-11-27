import { useState, useEffect } from "react";
import { FoodCategory } from "../../types/category";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import {Button} from "../common/Button";

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
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Category Name</label>
                    <input
                        type="text"
                        id="name"
                        name="categoryName"  // Ensure this matches the property you want to update
                        value={editedCategory.categoryName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                <Button onClick={onClose} className="btn btn-subtle">Cancel</Button>
                <Button type="submit" className="btn btn-primary">Save Changes</Button>
                </div>
            </form>
        </div>
    )
}