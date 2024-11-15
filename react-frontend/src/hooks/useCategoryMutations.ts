import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories';

export const useCategoryMutations = () => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (categoryId: number) => {
            console.log(`Deleting category with ID: ${categoryId}`);
            return categoriesApi.deleteCategory(categoryId);
        },
        onSuccess: () => {
            console.log("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
            console.error("Error deleting category:", error);
        }
    });

    return { deleteMutation };
};
