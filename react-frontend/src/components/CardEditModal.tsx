import React, { useState } from 'react';
import { FoodProduct } from '../types/foodProduct';

interface CardEditModalProps {
    foodProduct: FoodProduct;
    show: boolean;
    onClose: () => void;
    onSave: (updatedProduct: FoodProduct) => Promise<void>;
}

export const CardEditModal: React.FC<CardEditModalProps> = ({ foodProduct, show, onClose, onSave }) => {
    console.log('Incoming foodProduct:', foodProduct);

    const [editedProduct, setEditedProduct] = useState<FoodProduct>({
        ...foodProduct,
        foodCategoryId: foodProduct.foodCategoryId  // Explicitly set this
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(editedProduct);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setEditedProduct(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseFloat(value) : value,
            foodCategoryId: prev.foodCategoryId
        }));
    };

    console.log('Current editedProduct:', editedProduct);

    if (!show) return null;

    return (
        <div className="modal show d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Product</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
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
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editedProduct.categoryName}
                                    disabled
                                />
                                <input
                                    type="hidden"
                                    name="foodCategoryId"
                                    value={editedProduct.foodCategoryId}
        />
                            </div>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
                      