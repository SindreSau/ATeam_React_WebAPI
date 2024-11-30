import {useMutation, useQueryClient} from '@tanstack/react-query';
import {categoriesApi} from '../api/categories';
import {CategoryCreate} from '../types/category';

export const useCategoryMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (category: CategoryCreate) =>
            categoriesApi.createCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['categories']});
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: number; category: CategoryCreate }) =>
            categoriesApi.updateCategory(data.id, data.category),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['categories']});
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (categoryId: number) => {
            try {
                const response = await categoriesApi.deleteCategory(categoryId);
                return response.data;
            } catch (error: any) {
                // Extract error message from the response
                const errorMessage = error.response?.data?.error ||
                    'Failed to delete category';
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });

    return {
        createMutation,
        updateMutation,
        deleteMutation
    };
};
