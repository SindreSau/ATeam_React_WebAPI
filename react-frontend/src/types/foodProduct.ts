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
    categoryName: string;
    createdByUsername: string;
}

// Create/Update DTO
export interface FoodProductCreate {
    productName: string;  // maxLength: 100
    energyKcal: number;  // min: 0, max: 1000
    fat: number;        // min: 0, max: 100
    carbohydrates: number; // min: 0, max: 100
    protein: number;    // min: 0, max: 100
    fiber: number;      // min: 0, max: 100
    salt: number;       // min: 0, max: 100
    foodCategoryId: number; // Note: this is foodCategoryId, not categoryId
}