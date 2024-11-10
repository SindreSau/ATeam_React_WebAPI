import {useCallback, useState} from 'react';
import {FoodProduct, FoodProductCreateUpdate} from '../../types/foodProduct';
import {SearchForm} from '../common/SearchForm';
import {CreateFoodProductModal} from '../modals/CreateFoodProductModal';
import {CardEditModal} from '../modals/CardEditModal';
import ConfirmationModal from "../modals/ConfirmationModal";
import {useProductMutations} from "../../hooks/useProductMutations";
import {useProductList} from "../../hooks/useProductList";
import Toast from "../common/Toast";
import {ProductGrid} from "./ProductGrid";
import {ProductControls} from "./ProductControls";
import {PaginationSection} from "./PaginationSection";
import ProductGridSkeleton from "./ProductGridSkeleton";

export const VendorProductList = () => {
    // Local state for modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editModalProduct, setEditModalProduct] = useState<FoodProduct | null>(null);
    const [deleteModalProduct, setDeleteModalProduct] = useState<FoodProduct | null>(null);

    // Toast state
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
        isVisible: boolean;
    } | null>(null);

    // Mutations and product list hook
    const {createMutation, updateMutation, deleteMutation} = useProductMutations();
    const {
        data,
        isLoading,
        isFetching,
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
        mode: 'vendor',
        storageKey: 'vendorPreferredPageSize'
    });

    // Memoized callbacks
    const handleCreateModalOpen = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const handleCreateModalClose = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleEditProduct = useCallback((product: FoodProduct) => {
        setEditModalProduct(product);
    }, []);

    const handleDeleteProduct = useCallback((product: FoodProduct) => {
        setDeleteModalProduct(product);
    }, []);

    const handleCreateProduct = useCallback(async (data: FoodProductCreateUpdate) => {
        try {
            await createMutation.mutateAsync(data);
            setIsCreateModalOpen(false);
            setToast({
                type: 'success',
                message: 'Product created successfully!',
                isVisible: true
            });
        } catch (error) {
            setToast({
                type: 'error',
                message: 'Failed to create product. Please try again.',
                isVisible: true
            });
            console.error('Failed to create product:', error);
        }
    }, [createMutation]);

    const handleUpdateProduct = useCallback(async (updatedProduct: FoodProduct) => {
        try {
            const updateDto: FoodProductCreateUpdate = {
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
                message: 'Product updated successfully!',
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
            setDeleteModalProduct(null);
            setToast({
                type: 'success',
                message: 'Product deleted successfully!',
                isVisible: true
            });
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
                onCreateClick={handleCreateModalOpen}
                showCreateButton={true}
            />

            <div className="mb-4">
                <SearchForm
                    initialSearch={searchParams.get('search') || ''}
                    onSearch={handleSearch}
                />
            </div>

            <ProductGrid
                products={data?.items || []}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                isDeleting={deleteMutation.isPending}
                isLoading={isLoading || isFetching}
                amountOfProducts={pageSize} // Show skeleton for the amount of products per page
                deletingProductId={deleteModalProduct?.productId}
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


            {/* Modals */}
            <CreateFoodProductModal
                isOpen={isCreateModalOpen}
                onClose={handleCreateModalClose}
                onSubmit={handleCreateProduct}
                isLoading={createMutation.isPending}
            />

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

            {/* Toast */}
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