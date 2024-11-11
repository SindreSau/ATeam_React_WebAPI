import React, { useEffect } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey";

interface FoodProduct {
  productId: number;
  productName: string;
  categoryName: string;
  createdByUsername: string;
  nokkelhullQualified: boolean;
  energyKcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
}

interface FoodProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodProduct: FoodProduct;
}

const FoodProductModal: React.FC<FoodProductModalProps> = ({
  isOpen,
  onClose,
  foodProduct,
}) => {
  // Handle body class for modal open state
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  useEscapeKey(onClose);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const nutritionItems = [
    { label: "Energy", value: `${foodProduct.energyKcal.toFixed(0)} kcal` },
    { label: "Protein", value: `${foodProduct.protein.toFixed(1)} g` },
    { label: "Fat", value: `${foodProduct.fat.toFixed(1)} g` },
    {
      label: "Carbohydrates",
      value: `${foodProduct.carbohydrates.toFixed(1)} g`,
    },
    { label: "Fiber", value: `${foodProduct.fiber.toFixed(1)} g` },
    { label: "Salt", value: `${foodProduct.salt.toFixed(1)} g` },
  ];

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`modal fade ${isOpen ? "show d-block" : ""}`}
        tabIndex={-1}
        onClick={handleBackdropClick}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Details for {foodProduct.productName}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/* Nutritional Information Grid */}
              <div className="row g-3">
                {nutritionItems.map((item) => (
                  <div key={item.label} className="col-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">
                          {item.label}
                        </h6>
                        <p
                          className={`card-text fs-4 mb-0 ${
                            foodProduct.nokkelhullQualified
                              ? "text-success"
                              : "text-warning"
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Information */}
              <div className="mt-4 card">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">
                    Product Information
                  </h6>
                  <div className="row mb-2">
                    <div className="col">
                      <span className="fs-6 text-muted">Category</span>
                    </div>
                    <div className="col text-end">
                      <span className="fs-6 fw-medium">
                        {foodProduct.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col">
                      <span className="fs-6 text-muted">Created By</span>
                    </div>
                    <div className="col text-end">
                      <span className="fs-6 fw-medium">
                        {foodProduct.createdByUsername}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    {foodProduct.nokkelhullQualified ? (
                      <span className="badge bg-success py-2 px-3">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Nøkkelhull Qualified
                      </span>
                    ) : (
                      <span className="badge bg-danger py-2 px-3">
                        <i className="bi bi-x-circle-fill me-2"></i>
                        Not Qualified for Nøkkelhull
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer"></div>
          </div>
        </div>
      </div>

      {isOpen && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default FoodProductModal;
