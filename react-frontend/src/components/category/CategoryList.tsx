import { useCallback, useState } from "react";
import { FoodCategory } from "../../types/category";
import { useCategoryMutations } from "../../hooks/useCategoryMutations";
import ConfirmationModal from "../modals/ConfirmationModal";
import { CategoryTable } from "./CategoryTable";
import { useCategoryList } from "../../hooks/useCategoryList";

export const CategoryList = () => { 
    const [deleteModalCategory, setDeleteModalCategory] = useState<FoodCategory | null>(null);
    const { deleteMutation } = useCategoryMutations();
    const data = useCategoryList();

    

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
                isDeleting={deleteMutation.isPending}
                deletingCategoryId={deleteModalCategory?.categoryId}
            />

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