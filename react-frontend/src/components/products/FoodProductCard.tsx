import React, { useState } from "react";
import { FoodProduct } from "../../types/foodProduct";
import { Button } from "../common/Button";

interface FoodProductCardProps {
  foodProduct: FoodProduct;
  onDelete: (productId: number) => Promise<void> | void;
  onEdit: (foodProduct: FoodProduct) => void;
  isDeleting?: boolean;
  mode: "admin" | "vendor";
}

export const FoodProductCard: React.FC<FoodProductCardProps> = ({
  foodProduct,
  onDelete,
  onEdit,
  isDeleting = false,
  mode,
}) => {
  const nutritionBadges = [
    { label: "Energy", value: `${foodProduct.energyKcal.toFixed(0)} kcal` },
    { label: "Protein", value: `${foodProduct.protein.toFixed(1)} g` },
    { label: "Fat", value: `${foodProduct.fat.toFixed(1)} g` },
    { label: "Carbs", value: `${foodProduct.carbohydrates.toFixed(1)} g` },
    { label: "Fiber", value: `${foodProduct.fiber.toFixed(1)} g` },
    { label: "Salt", value: `${foodProduct.salt.toFixed(1)} g` },
  ];

  const handleDelete = () => {
    onDelete(foodProduct.productId);
  };

  const renderVendorContent = () => (
    <>
      <div className="card-body flex-grow-1">
        <div className="d-flex flex-wrap gap-2">
          {nutritionBadges.map((badge) => (
            <div
              key={badge.label}
              className="badge bg-discovery d-flex align-items-center"
              title={`${badge.label}: ${badge.value}`}
            >
              <span className="fw-ligh">{badge.label}:</span>
              <span className="ms-1 fw-semibold">{badge.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer border-top mt-auto">
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => onEdit(foodProduct)}
            aria-label={`Edit ${foodProduct.productName}`}
          >
            <i className="fa fa-pencil me-1"></i>
            Edit
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete ${foodProduct.productName}`}
          >
            {isDeleting ? (
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
              />
            ) : (
              <i className="fa fa-trash me-1"></i>
            )}
            Delete
          </Button>
        </div>
      </div>
    </>
  );

  const renderAdminContent = () => (
    <>
      <div className="card-body flex-grow-1">
        <p className="mb-0">Created by {foodProduct.createdByUsername}</p>
      </div>
      <div className="card-footer border-top mt-auto">
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            aria-label={`View details for ${foodProduct.productName}`}
          >
            <i className="fa fa-info-circle me-1"></i>
            Details
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="card h-100 d-flex flex-column">
      <div className="card-header border-bottom position-relative">
        <div className="d-flex flex-column">
          <h6 className="mb-2 fs-base">{foodProduct.productName}</h6>
          <span className="text-muted fs-sm">{foodProduct.categoryName}</span>
        </div>
        {foodProduct.nokkelhullQualified && (
          <div className="position-absolute top-0 end-0 mt-3 me-3">
            <img
              src="/favicon.png"
              alt="Nøkkelhull Certified"
              width="24"
              height="24"
            />
          </div>
        )}
      </div>
      {mode === "vendor" ? renderVendorContent() : renderAdminContent()}
    </div>
  );
};
