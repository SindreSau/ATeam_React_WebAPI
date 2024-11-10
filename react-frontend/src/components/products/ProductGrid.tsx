// src/components/products/ProductGrid.tsx
import React, {memo} from 'react';
import {FoodProduct} from '../../types/foodProduct';
import {FoodProductCard} from './FoodProductCard';
import ProductGridSkeleton from "./ProductGridSkeleton";

interface ProductGridProps {
    products: FoodProduct[];
    onEdit?: (product: FoodProduct) => void;
    onDelete?: (product: FoodProduct) => void;
    isDeleting?: boolean;
    isLoading?: boolean;
    amountOfProducts?: number;
    deletingProductId?: number;
    displayEditButton?: boolean;
    displayDeleteButton?: boolean;
}

export const ProductGrid = memo(({
                                     products,
                                     onEdit,
                                     onDelete,
                                     isDeleting,
                                     isLoading,
                                     amountOfProducts = 6,
                                     deletingProductId,
                                     displayEditButton = true,
                                     displayDeleteButton = true,
                                 }: ProductGridProps) => {

    if (isLoading) {
        return <ProductGridSkeleton amountOfProducts={amountOfProducts}/>;
    }

    if (products.length === 0) {
        return <div className="text-center my-4">No products found</div>;
    }

    return (
        <div className="row g-4">
            {products.map((product) => (
                <div key={product.productId} className="col-12 col-sm-6 col-lg-4">
                    <FoodProductCard
                        foodProduct={product}
                        onEdit={() => onEdit?.(product)}
                        onDelete={() => onDelete?.(product)}
                        isDeleting={isDeleting && deletingProductId === product.productId}
                        displayEditButton={displayEditButton}
                        displayDeleteButton={displayDeleteButton}
                    />
                </div>
            ))}
        </div>
    );
});