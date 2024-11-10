// src/components/AdminProductList.tsx
import {useState} from 'react';
import {FoodProduct} from '../types/foodProduct';
import {SearchForm} from './SearchForm';
import {FoodProductCard} from './FoodProductCard';
import PaginationController from './PaginationController';
import Spinner from './Spinner';
import {CardEditModal} from './CardEditModal';
import {NokkelhullFilter} from './NokkelHullFilter';
import {ProductSort} from './ProductSort';
import ConfirmationModal from "./ConfirmationModal";
import {useProductMutations} from "../hooks/useProductMutations";
import {useProductList} from "../hooks/useProductList";
import Toast from "./Toast";

export const AdminProductList = () => {
    // Local state for modals
    const [editModalProduct, setEditModalProduct] = useState<FoodProduct | null>(null);
    const [deleteModalProduct, setDeleteModalProduct] = useState<FoodProduct | null>(null);

    // Toast state
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
        isVisible: boolean;
    } | null>(null);

    // Mutations and product list hook
    const {updateMutation, deleteMutation} = useProductMutations();
    const {
        data,
        isLoading,
        isError,
        error,
        currentPage,
        orderBy,
        nokkelhull,
        pageSize,
        pageSizeOptions,
        searchParams,
        handlePageChange,
        handlePageSizeChange,
        handleSearch,
        handleSort,
        handleNokkelhullFilter,
    } = useProductList({
        mode: 'admin',
        storageKey: 'adminPreferredPageSize'
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
            setToast({
                type: 'success',
                message: `${updatedProduct.productName} was successfully updated!`,
                isVisible: true
            });
        } catch (error) {
            setToast({
                type: 'error',
                message: 'Failed to update product. Please try again.',
                isVisible: true
            });
            console.error('Failed to update product:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModalProduct) return;

        try {
            await deleteMutation.mutateAsync(deleteModalProduct.productId);
            setToast({
                type: 'success',
                message: `${deleteModalProduct.productName} was successfully deleted!`,
                isVisible: true
            });
            setDeleteModalProduct(null);
        } catch (error) {
            setToast({
                type: 'error',
                message: 'Failed to delete product. Please try again.',
                isVisible: true
            });
            console.error('Failed to delete product:', error);
        }
    };

    if (isLoading) return <Spinner/>;
    if (isError) return <div className="alert alert-danger">Error: {(error as Error).message}</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">All Products</h1>

                <div className="d-flex gap-3 align-items-center">
                    <ProductSort value={orderBy} onChange={handleSort}/>
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
                            displayEditButton={false}
                            displayDeleteButton={false}
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


            {/* Add right before the closing div of the container */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    isVisible={toast.isVisible}
                    onClose={() => setToast(null)}
                    autoDismiss={true}
                    autoDismissTimeout={2000} // Toast will disappear after 2 seconds
                    title={toast.type === 'success' ? 'Success' : 'Error'}
                />
            )}
        </div>
    );
};