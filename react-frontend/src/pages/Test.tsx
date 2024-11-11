import React, { useState } from "react";
import FoodProductModal from "../components/modals/FoodProductModal";

const TestPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample food product data for testing
  const sampleFoodProduct = {
    productId: 1,
    productName: "Test Product",
    foodCategoryId: 1,
    categoryName: "Test Category",
    createdByUsername: "Test User",
    nokkelhullQualified: true,
    energyKcal: 250,
    protein: 50.5,
    fat: 8.2,
    carbohydrates: 120.5,
    fiber: 3.2,
    salt: 0.8,
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h1>Modal Test Page</h1>
          <p className="text-muted">
            Click the button below to test the food product modal
          </p>

          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Open Test Modal
          </button>

          <FoodProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            foodProduct={sampleFoodProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default TestPage;
