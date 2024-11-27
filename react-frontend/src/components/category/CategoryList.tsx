import { useCallback, useState, useEffect } from "react";
import { FoodCategory } from "../../types/category";
import { useCategoryMutations } from "../../hooks/useCategoryMutations";
import ConfirmationModal from "../modals/ConfirmationModal";
import { CategoryTable } from "./CategoryTable";
import { useCategoryList } from "../../hooks/useCategoryList";
import { CategoryEditModal } from "../modals/CategoryEditModal";

export const CategoryList = () => {
    const [editModalCategory, setEditModalCategory] = useState<FoodCategory | null>(null);
    const [deleteModalCategory, setDeleteModalCategory] = useState<FoodCategory | null>(null);
    const { updateMutation, deleteMutation } = useCategoryMutations();
    const data = useCategoryList();

    const handleEditCategory = useCallback((category: FoodCategory) => {
        console.log("Edit clicked - Category:", category);
        console.log("Current edit modal state before:", !!editModalCategory);
        setEditModalCategory(category);
        console.log("Current edit modal state after:", !!editModalCategory);
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
        } catch (error) {
            console.error('Failed to update category:', error);
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

        await deleteMutation.mutateAsync(deleteModalCategory.categoryId);
        setDeleteModalCategory(null);
    }, [deleteMutation, deleteModalCategory]);

    const handleCloseDeleteModal = useCallback(() => {
        setDeleteModalCategory(null);
    }, []);

    return (
        <div className="container py-4">
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
        </div>
    );
};