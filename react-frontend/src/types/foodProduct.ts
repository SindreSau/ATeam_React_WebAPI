// src/types/foodProduct.ts

// Response DTO
export interface FoodProduct {
    productId: number;
    productName: string;
    energyKcal: number;
    fat: number;
    carbohydrates: number;
    protein: number;
    fiber: number;
    salt: number;
    nokkelhullQualified: boolean;
    foodCategoryId: number;
    categoryName: string;
    createdByUsername: string;
}

// Create/Update DTO
export interface FoodProductCreateUpdate {
    productName: string;
    energyKcal: number;
    fat: number;
    carbohydrates: number;
    protein: number;
    fiber: number;
    salt: number;
    foodCategoryId: number;
}