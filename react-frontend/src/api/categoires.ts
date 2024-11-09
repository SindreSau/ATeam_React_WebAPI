// src/api/categories.ts
import api from './axios';
import { AxiosResponse } from 'axios';

interface FoodCategory {
    categoryId: number;
    categoryName: string;
}

interface CategoryCreate {
    categoryName: string;
}

export const categoriesApi = {
    getCategories: (): Promise<AxiosResponse<FoodCategory[]>> =>
        api.get('/Category'),

    getCategory: (id: number): Promise<AxiosResponse<FoodCategory>> =>
        api.get(`/Category/${id}`),

    createCategory: (category: CategoryCreate): Promise<AxiosResponse<FoodCategory>> =>
        api.post('/Category', category),

    updateCategory: (id: number, category: CategoryCreate): Promise<AxiosResponse<FoodCategory>> =>
        api.put(`/Category/${id}`, category),

    deleteCategory: (id: number): Promise<AxiosResponse<void>> =>
        api.delete(`/Category/${id}`),
};