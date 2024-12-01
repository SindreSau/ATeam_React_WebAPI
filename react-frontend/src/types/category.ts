export interface FoodCategory {
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryCreate {
    categoryName: string;
}
