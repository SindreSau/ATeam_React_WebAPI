import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories';

export const useCategoryList = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getCategories();
            return { items: response.data};
        },
    });
};
