import { Button } from "../common/Button";
import { NokkelhullFilter } from "./NokkelHullFilter";
import { ProductSort } from "./ProductSort";
import { memo } from "react";
import { SearchForm } from "../common/SearchForm";

interface ProductControlsProps {
    orderBy: string;
    nokkelhull: boolean | undefined;
    onSort: (value: string) => void;
    onNokkelhullFilter: (value: boolean | null) => void;
    onCreateClick?: () => void;
    showCreateButton?: boolean;
    searchParams: URLSearchParams;
    onSearch: (value: string) => void;
}

export const ProductControls = memo(({
                                         orderBy,
                                         nokkelhull,
                                         onSort,
                                         onNokkelhullFilter,
                                         onCreateClick,
                                         showCreateButton = false,
                                         searchParams,
                                         onSearch
                                     }: ProductControlsProps) => {
    return (
        <div className="container-fluid px-0">
            <div className="d-flex flex-column gap-4 mb-4">
                {/* Header and Create Button Row */}
                <div className="d-flex justify-content-between align-items-stretch flex-wrap gap-3">
                    <h1 className=" mb-0">
                        {showCreateButton ? 'My Products' : 'All Products'}
                    </h1>
                    {showCreateButton && (
                        <Button
                            variant="primary"
                            onClick={onCreateClick}
                            className="order-md-2"
                        >
                            <i className="fa fa-plus-circle me-2"></i>
                            Add New Product
                        </Button>
                    )}
                </div>

                {/* Search Form */}
                <SearchForm
                    initialSearch={searchParams.get('search') || ''}
                    onSearch={onSearch}
                />

                {/* Filters Row */}
                <div className="d-flex flex-wrap gap-3 align-items-stretch">
                    <ProductSort value={orderBy} onChange={onSort}/>
                    <NokkelhullFilter
                        value={nokkelhull === undefined ? null : nokkelhull}
                        onChange={onNokkelhullFilter}
                    />
                </div>
            </div>
        </div>
    );
});

ProductControls.displayName = 'ProductControls';