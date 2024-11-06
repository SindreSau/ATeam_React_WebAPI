import { FoodProduct } from '../types/foodProduct';
import { PaginatedResponse } from '../types/common';

export const fetchFoodProducts = async (searchTerm: string, pagination: { pageNumber: number, pageSize: number }
): Promise<PaginatedResponse<FoodProduct>> => {
    const queryParams = new URLSearchParams({
        search: searchTerm,
        pageNumber: pagination.pageNumber.toString(),
        pageSize: pagination.pageSize.toString()
    });



    if (!response.ok) {
        throw new Error('Failed to fetch food products');
    }

    return response.json();
}; 

    if (!response.ok) {
        throw new Error('Failed to fetch food products');
    }

    return response.json();
}; 