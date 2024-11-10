// src/components/products/ProductControls.tsx
import {Button} from "../common/Button";
import {NokkelhullFilter} from "./NokkelHullFilter";
import {ProductSort} from "./ProductSort";
import {memo} from "react";

interface ProductControlsProps {
    orderBy: string;
    nokkelhull: boolean | undefined;
    onSort: (value: string) => void;
    onNokkelhullFilter: (value: boolean | null) => void;
    onCreateClick?: () => void;
    showCreateButton?: boolean;
}

export const ProductControls = memo(function ProductControls({
                                                                 orderBy,
                                                                 nokkelhull,
                                                                 onSort,
                                                                 onNokkelhullFilter,
                                                                 onCreateClick,
                                                                 showCreateButton = false,
                                                             }: ProductControlsProps) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">{showCreateButton ? 'My Products' : 'All Products'}</h1>

            <div className="d-flex gap-3 align-items-center">
                <ProductSort value={orderBy} onChange={onSort} />
                <NokkelhullFilter
                    value={nokkelhull === undefined ? null : nokkelhull}
                    onChange={onNokkelhullFilter}
                />
                {showCreateButton && (
                    <Button
                        variant="primary"
                        onClick={onCreateClick}
                    >
                        <i className="fa fa-plus-circle me-2"></i>
                        Add New Product
                    </Button>
                )}
            </div>
        </div>
    );
});
