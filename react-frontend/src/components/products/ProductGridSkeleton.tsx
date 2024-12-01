// src/components/products/ProductGridSkeleton.tsx
import React from 'react';

interface ProductGridSkeletonProps {
    amountOfProducts: number;
}

const ProductGridSkeleton = ({amountOfProducts}: ProductGridSkeletonProps) => {
    return (
        <div className="row g-4">
            {[...Array(amountOfProducts)].map((_, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-4">
                    <div className="card h-100 d-flex flex-column">
                        {/* Card header with product name and category */}
                        <div className="card-header border-bottom position-relative">
                            <div className="placeholder-glow">
                                <span className="placeholder col-8 mb-1"></span>
                                <span className="placeholder col-5"></span>
                            </div>
                            {/* Nøkkelhull position */}
                            <div className="position-absolute top-0 end-0 mt-3 me-3">
                                <span className="placeholder rounded-circle" style={{ width: '24px', height: '24px' }}></span>
                            </div>
                        </div>

                        {/* Card body with nutrition badges */}
                        <div className="card-body flex-grow-1">
                            <div className="placeholder-glow d-flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6].map((badgeIndex) => (
                                    <span
                                        key={badgeIndex}
                                        className="placeholder col-4"
                                        style={{ height: '24px' }}
                                    ></span>
                                ))}
                            </div>
                        </div>

                        {/* Card footer with action buttons */}
                        <div className="card-footer border-top">
                            <div className="placeholder-glow d-flex gap-2">
                                <span className="placeholder col-4" style={{ height: '38px' }}></span>
                                <span className="placeholder col-4" style={{ height: '38px' }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGridSkeleton;