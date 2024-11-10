import React, { useState } from 'react';
import { FoodProduct } from '../types/foodProduct';
import { CardEditModal}from './CardEditModal';
import { Link } from 'react-router-dom';

interface FoodProductCardProps {
    foodProduct: FoodProduct;
    onDelete: (productId: number) => void;
    onEdit: (foodProduct: FoodProduct) => void;
    
}

export const FoodProductCard: React.FC<FoodProductCardProps> = ({ foodProduct, onEdit }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    return (
        <div className="card mb-3">
        <div className="card-body rounded-5">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title h3 mb-0">{foodProduct.productName}</h2>
                {foodProduct.nokkelhullQualified && (
                    <img 
                        src="/favicon.png"
                        alt="Nøkkelhull" 
                        className="ms-2" 
                        style={{width: '24px', height: '24px'}} 
                    />
                )}
            </div>
            <p className="card-text text-muted small mb-2">
                Category: {foodProduct.categoryName}
            </p>
            <div className="row mb-3">
                <div className="col-auto">
                    <span className="badge bg-discovery">Energy: {foodProduct.energyKcal.toFixed(0)} kcal</span>
                </div>
                <div className="col-auto">
                    <span className="badge bg-discovery">Protein: {foodProduct.protein} g</span>
                </div>
                <div className="col-auto">
                    <span className="badge bg-discovery">Fat: {foodProduct.fat} g</span>
                </div>
                <div className="col-auto">
                    <span className="badge bg-discovery">Carbs: {foodProduct.carbohydrates} g</span>
                </div>
                <div className="col-auto">
                    <span className="badge bg-discovery">Fiber: {foodProduct.fiber} g</span>
                </div>
                <div className="col-auto">
                    <span className="badge bg-discovery">Salt: {foodProduct.salt} g</span>
                </div>
            </div>
            <div className="d-flex gap-2">
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onEdit(foodProduct)}
                >
                    <i className="fa fa-pencil"></i> Edit
                </button>
                <button 
                    className="btn btn-sm btn-outline-danger" 
                    //onClick={() => onDelete(foodProduct.productId)}
                >
                    <i className="fa fa-trash"></i> Delete
                </button>
            </div>
        </div>
    </div>
    );
};
