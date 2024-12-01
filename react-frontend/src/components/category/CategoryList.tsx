import { useCallback, useState } from "react";
import { FoodCategory } from "../../types/category";
import { useCategoryMutations } from "../../hooks/useCategoryMutations";
import ConfirmationModal from "../modals/ConfirmationModal";
import { CategoryTable } from "./CategoryTable";
import { useCategoryList } from "../../hooks/useCategoryList";
import { CategoryEditModal } from "../modals/CategoryEditModal";
import Toast from "../common/Toast";
import { Button } from "../common/Button";

export const CategoryList = () => {
    const [editModalCategory, setEditModalCategory] = useState<FoodCategory | null>(null);
    const [deleteModalCategory, setDeleteModalCategory] = useState<FoodCategory | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
        isVisible: boolean;
    } | null>(null);

    const { createMutation, updateMutation, deleteMutation } = useCategoryMutations();
    const data = useCategoryList();

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await createMutation.mutateAsync({ categoryName: newCategoryName });
            setNewCategoryName('');
            setToast({
                type: 'success',
                message: 'Category created successfully',
                isVisible: true
            });
        } catch (error: any) {
            setToast({
                type: 'error',
                message: error.message || 'Failed to create category',
                isVisible: true
            });
        }
    };

    const handleEditCategory = useCallback((category: FoodCategory) => {
        setEditModalCategory(category);
    }, []);

    const handleUpdateCategory = useCallback(async (updatedCategory: FoodCategory) => {
        try {
            const updateDto = {
                categoryName: updatedCategory.categoryName
            };

            await updateMutation.mutateAsync({
                id: updatedCategory.categoryId,
                category: updateDto
            });
            setEditModalCategory(null);
            setToast({
                type: 'success',
                message: 'Category updated successfully',
                isVisible: true
            });
        } catch (error: any) {
            setToast({
                type: 'error',
                message: error.message || 'Failed to update category',
                isVisible: true
            });
        }
    }, [updateMutation]);

    const handleCloseEditModal = useCallback(() => {
        setEditModalCategory(null);
    }, []);

    const handleDeleteCategory = useCallback((categoryId: number) => {
        const categoryToDelete = data?.data?.items.find(item => item.categoryId === categoryId);
        if (categoryToDelete){
            setDeleteModalCategory(categoryToDelete);
        }

    }, [data]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteModalCategory) return;

        try {
            await deleteMutation.mutateAsync(deleteModalCategory.categoryId);
            setToast({
                type: 'success',
                message: 'Category deleted successfully',
                isVisible: true
            });
            setDeleteModalCategory(null);
        } catch (error: any) {
            setToast({
                type: 'error',
                message: error.message || 'Failed to delete category',
                isVisible: true
            });
            setDeleteModalCategory(null);
        }
    }, [deleteMutation, deleteModalCategory]);

    const handleCloseToast = useCallback(() => {
        setToast(null);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setDeleteModalCategory(null);
    }, []);

    return (
        <div className="container py-4">
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Create New Category</h5>
                    <form onSubmit={handleCreateCategory} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            className="btn btn-primary"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"/>
                                    Creating...
                                </>
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </form>
                </div>
            </div>

            <CategoryTable
                categories={data?.data?.items ?? []}
                onDelete={handleDeleteCategory}
                onEdit={handleEditCategory}
                isDeleting={deleteMutation.isPending}
                deletingCategoryId={deleteModalCategory?.categoryId}
            />

            {editModalCategory && (
                <CategoryEditModal
                    category={editModalCategory}
                    show={!!editModalCategory}
                    onClose={handleCloseEditModal}
                    onSave={handleUpdateCategory}
                />
            )}

            <ConfirmationModal
                isOpen={!!deleteModalCategory}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteConfirm}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteModalCategory?.categoryName}"? This action cannot be undone.`}
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
                    title={toast.type === 'error' ? 'Error' : 'Success'}
                />
            )}
        </div>
    );
};