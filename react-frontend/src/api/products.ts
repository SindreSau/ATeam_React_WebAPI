// src/api/products.ts
import api from './axios';
import { AxiosResponse } from 'axios';
import { FoodProduct, FoodProductCreate } from '../types/foodProduct';

interface PaginatedResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface ProductQueryParams {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: string;
    nokkelhull?: boolean;
    searchTerm?: string;
}

export const productsApi = {
    // Vendor endpoints
    getVendorProducts: (params: ProductQueryParams): Promise<AxiosResponse<PaginatedResponse<FoodProduct>>> =>
        api.get('/Vendor', { params }),

    getVendorProduct: (id: number): Promise<AxiosResponse<FoodProduct>> =>
        api.get(`/Vendor/${id}`),

    createProduct: (product: FoodProductCreate): Promise<AxiosResponse<FoodProduct>> =>
        api.post('/Vendor', product),

    updateProduct: (id: number, product: FoodProductCreate): Promise<AxiosResponse<FoodProduct>> =>
        api.put(`/Vendor/${id}`, product),

    deleteProduct: (id: number): Promise<AxiosResponse<void>> =>
        api.delete(`/Vendor/${id}`),

    // Admin endpoints
    getAdminProducts: (params: ProductQueryParams): Promise<AxiosResponse<PaginatedResponse<FoodProduct>>> =>
        api.get('/Admin', { params }),

    getAdminProduct: (id: number): Promise<AxiosResponse<FoodProduct>> =>
        api.get(`/Admin/${id}`),

    deleteAdminProduct: (id: number): Promise<AxiosResponse<void>> =>
        api.delete(`/Admin/${id}`),
};