// hooks/useProductMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { FoodProductCreateUpdate } from '../types/foodProduct';

export const useProductMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (newProduct: FoodProductCreateUpdate) =>
            productsApi.createProduct(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: number; product: FoodProductCreateUpdate }) =>
            productsApi.updateProduct(data.id, data.product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (productId: number) =>
            productsApi.deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
        }
    });

    return {
        createMutation,
        updateMutation,
        deleteMutation
    };
};
