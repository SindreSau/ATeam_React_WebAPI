// src/components/products/AdminProductList.tsx
import { useCallback, useState } from 'react';
import { FoodProduct } from '../../types/foodProduct';
import { SearchForm } from '../common/SearchForm';
import PaginationController from '../common/PaginationController';
import Spinner from '../common/Spinner';
import { CardEditModal } from '../modals/CardEditModal';
import ConfirmationModal from "../modals/ConfirmationModal";
import { useProductMutations } from "../../hooks/useProductMutations";
import { useProductList } from "../../hooks/useProductList";
import Toast from "../common/Toast";
import { ProductGrid } from './ProductGrid';
import { ProductControls } from './ProductControls';
import {PaginationSection} from "./PaginationSection";

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
    const { updateMutation, deleteMutation } = useProductMutations();
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

    // Memoized callbacks
    const handleEditProduct = useCallback((product: FoodProduct) => {
        setEditModalProduct(product);
    }, []);

    const handleDeleteProduct = useCallback((product: FoodProduct) => {
        setDeleteModalProduct(product);
    }, []);

    const handleUpdateProduct = useCallback(async (updatedProduct: FoodProduct) => {
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
    }, [updateMutation]);

    const handleDeleteConfirm = useCallback(async () => {
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
    }, [deleteMutation, deleteModalProduct]);

    const handleCloseEditModal = useCallback(() => {
        setEditModalProduct(null);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setDeleteModalProduct(null);
    }, []);

    const handleCloseToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <div className="container py-4">
            <ProductControls
                orderBy={orderBy}
                nokkelhull={nokkelhull}
                onSort={handleSort}
                onNokkelhullFilter={handleNokkelhullFilter}
                showCreateButton={false}
                searchParams={searchParams}
                onSearch={handleSearch}
            />

            <ProductGrid
                products={data?.items ?? []}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                isDeleting={deleteMutation.isPending}
                isLoading={isLoading}
                amountOfProducts={pageSize}
                deletingProductId={deleteModalProduct?.productId}
                displayEditButton={false}
                displayDeleteButton={false}
            />

            {data && data.totalCount > 0 && (
                <PaginationSection
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    pageSize={pageSize}
                    totalCount={data.totalCount}
                    pageSizeOptions={pageSizeOptions}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            {editModalProduct && (
                <CardEditModal
                    foodProduct={editModalProduct}
                    show={!!editModalProduct}
                    onClose={handleCloseEditModal}
                    onSave={handleUpdateProduct}
                />
            )}

            <ConfirmationModal
                isOpen={!!deleteModalProduct}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteModalProduct?.productName}"? This action cannot be undone.`}
                confirmText="Delete"
                primaryButtonVariant="danger"
                isLoading={deleteMutation.isPending}
            />

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    isVisible={toast.isVisible}
                    onClose={handleCloseToast}
                    autoDismiss={true}
                    autoDismissTimeout={2000}
                    title={toast.type === 'success' ? 'Success' : 'Error'}
                />
            )}
        </div>
    );
};