// src/api/categories.ts
import api from './axios';
import { AxiosResponse } from 'axios';
import {CategoryCreate, FoodCategory} from "../types/category";


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