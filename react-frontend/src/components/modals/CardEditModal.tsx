import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {FoodProduct} from '../../types/foodProduct';
import {Button} from "../common/Button";
import {Select} from "../common/Select";
import {categoriesApi} from '../../api/categories';
import {useEscapeKey} from "../../hooks/useEscapeKey";

interface CardEditModalProps {
    foodProduct: FoodProduct;
    show: boolean;
    onClose: () => void;
    onSave: (updatedProduct: FoodProduct) => Promise<void>;
}

export const CardEditModal: React.FC<CardEditModalProps> = ({foodProduct, show, onClose, onSave}) => {

    // Initialize state with all the product data, including foodCategoryId
    const [editedProduct, setEditedProduct] = useState<FoodProduct>(foodProduct);

    // Close modal on escape key press
    useEscapeKey(onClose);

    // Fetch categories
    const {data: categories = []} = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getCategories();
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const categoryOptions = categories.map(category => ({
        value: category.categoryId,
        label: category.categoryName
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(editedProduct);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        
        setEditedProduct(prev => ({
            ...prev,
            [name]: name === 'foodCategoryId' ? Number(value) :
                type === 'number' ? parseFloat(value) : value
        }));
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
                            <h5 className="modal-title">Edit Product</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}/>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="productName"
                                        value={editedProduct.productName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <Select
                                        label="Category"
                                        options={categoryOptions}
                                        name="foodCategoryId"
                                        value={editedProduct.foodCategoryId.toString()} // Convert to string for select comparison
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Energy (kcal)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="energyKcal"
                                        value={editedProduct.energyKcal}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Fat (g)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="fat"
                                            value={editedProduct.fat}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Carbohydrates (g)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="carbohydrates"
                                            value={editedProduct.carbohydrates}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Protein (g)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="protein"
                                            value={editedProduct.protein}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Fiber (g)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="fiber"
                                            value={editedProduct.fiber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Salt (g)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="salt"
                                        value={editedProduct.salt}
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
