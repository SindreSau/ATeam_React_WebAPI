import { FoodProduct } from '../types/foodProduct';
import { PaginatedResponse } from '../types/common';

export const fetchFoodProducts = async (searchTerm: string, pagination: { pageNumber: number, pageSize: number }
): Promise<PaginatedResponse<FoodProduct>> => {
    const queryParams = new URLSearchParams({
        searchTerm: searchTerm || '',
        pageNumber: pagination.pageNumber.toString(),
        pageSize: pagination.pageSize.toString(),
        orderBy: 'productid'
    }).toString();
    
    const response = await fetch(`https://localhost:5001/api/admin?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.text();
            console.error('API Error:', errorData);
            throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    return {
        items: data.items || [],
        totalCount: data.totalCount || 0,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize
    };
};

