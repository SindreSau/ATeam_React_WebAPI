import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { FoodProduct } from '../types/foodProduct';
import { SearchForm } from './SearchForm';
import { FoodProductCard } from './FoodProductCard';
import PaginationController from './PaginationController';
import Spinner from './Spinner';
import { CardEditModal } from './CardEditModal';
import { NokkelhullFilter } from './NokkelHullFilter';
import { ProductSort } from './ProductSort';
import usePersistedState from '../hooks/usePersistedState';
import ConfirmationModal from "./ConfirmationModal";
import { useProductMutations } from "../hooks/useProductMutations";

export const AdminProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageSizeOptions = [2, 5, 10, 15];

    // Modal states
    const [editModalProduct, setEditModalProduct] = useState<FoodProduct | null>(null);
    const [deleteModalProduct, setDeleteModalProduct] = useState<FoodProduct | null>(null);

    // Use the mutations hook
    const { updateMutation, deleteMutation } = useProductMutations();

    // Get URL parameters
    const currentPage = Number(searchParams.get('page')) || 1;
    const orderBy = searchParams.get('orderBy') || 'createdat_desc';
    const nokkelhullParam = searchParams.get('nokkelhull');
    const nokkelhull: boolean | undefined = nokkelhullParam ? nokkelhullParam === 'true' : undefined;

    const urlPageSize = Number(searchParams.get('pageSize'));
    const validUrlPageSize = pageSizeOptions.includes(urlPageSize) ? urlPageSize : null;

    const [pageSize, setPageSize] = usePersistedState(
        'adminPreferredPageSize',
        pageSizeOptions[0],
        validUrlPageSize
    );

    // Products query
    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['adminProducts', {
            pageNumber: currentPage,
            pageSize,
            searchTerm: searchParams.get('search') || '',
            orderBy,
            nokkelhull
        }],
        queryFn: () => {
            const params = {
                pageNumber: currentPage,
                pageSize,
                searchTerm: searchParams.get('search') || '',
                orderBy,
                nokkelhull
            };
            return productsApi.getAdminProducts(params);
        },
        select: (response) => response.data
    });

    const handleUpdateProduct = async (updatedProduct: FoodProduct) => {
        try {
            const updateDto = {
                productName: updatedProduct.productName,
                energyKcal: updatedProduct.energyKcal,
                fat: updatedProduct.fat,
                carbohydrates: updatedProduct.carbohydrates,
                protein: updatedProduct.protein,
                fiber: updatedProduct.fiber,
                salt: updatedProduct.salt,
                foodCategoryId: updatedProduct.foodCategoryId
            };

            await updateMutation.mutateAsync({
                id: updatedProduct.productId,
                product: updateDto
            });
            setEditModalProduct(null);
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModalProduct) return;

        try {
            await deleteMutation.mutateAsync(deleteModalProduct.productId);
            setDeleteModalProduct(null);
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const updateSearchParams = (updates: Record<string, string>) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value === undefined || value === null) {
                    newParams.delete(key);
                } else {
                    newParams.set(key, value);
                }
            });
            return newParams;
        });
    };

    const handlePageChange = (page: number) => {
        updateSearchParams({ page: page.toString() });
    };

    const handlePageSizeChange = (newPageSize: number) => {
        updateSearchParams({
            pageSize: newPageSize.toString(),
            page: '1'
        });
        setPageSize(newPageSize);
    };

    const handleSearch = (search: string) => {
        updateSearchParams({
            search,
            page: '1'
        });
    };

    const handleSort = (value: string) => {
        updateSearchParams({
            orderBy: value,
            page: '1'
        });
    };

    const handleNokkelhullFilter = (value: boolean | null) => {
        if (value === null) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('nokkelhull');
                newParams.set('page', '1');
                return newParams;
            });
        } else {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('nokkelhull', value.toString());
                newParams.set('page', '1');
                return newParams;
            });
        }
    };

    if (isLoading) return <Spinner />;
    if (isError) return <div className="alert alert-danger">Error: {(error as Error).message}</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">All Products</h1>

                <div className="d-flex gap-3 align-items-center">
                    <ProductSort value={orderBy} onChange={handleSort} />
                    <NokkelhullFilter
                        value={nokkelhull === undefined ? null : nokkelhull}
                        onChange={handleNokkelhullFilter}
                    />
                </div>
            </div>

            <div className="mb-4">
                <SearchForm
                    initialSearch={searchParams.get('search') || ''}
                    onSearch={handleSearch}
                />
            </div>

            <div className="row g-4">
                {data?.items.map((product: FoodProduct) => (
                    <div key={product.productId} className="col-12 col-sm-6 col-lg-4">
                        <FoodProductCard
                            foodProduct={product}
                            onEdit={() => setEditModalProduct(product)}
                            onDelete={() => setDeleteModalProduct(product)}
                            isDeleting={deleteMutation.isPending && deleteModalProduct?.productId === product.productId}
                        />
                    </div>
                ))}
            </div>

            {data?.items.length === 0 && (
                <div className="text-center my-4">No products found</div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
                {data && data.totalCount > 0 && (
                    <PaginationController
                        currentPage={currentPage}
                        totalPages={data.totalPages}
                        pageSize={pageSize}
                        totalItems={data.totalCount}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={pageSizeOptions}
                    />
                )}

                <div className="text-muted">
                    Total items: {data?.totalCount || 0}
                </div>
            </div>

            {editModalProduct && (
                <CardEditModal
                    foodProduct={editModalProduct}
                    show={!!editModalProduct}
                    onClose={() => setEditModalProduct(null)}
                    onSave={handleUpdateProduct}
                />
            )}

            <ConfirmationModal
                isOpen={!!deleteModalProduct}
                onClose={() => setDeleteModalProduct(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteModalProduct?.productName}"? This action cannot be undone.`}
                confirmText="Delete"
                primaryButtonVariant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};