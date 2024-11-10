import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FoodProductCreateUpdate } from '../types/foodProduct';
import { categoriesApi } from '../api/categories';
import { Button } from './Button';
import {Select} from "./Select";

type FormErrors = Partial<Record<keyof FoodProductCreateUpdate, string>>;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FoodProductCreateUpdate) => Promise<void>;
    isLoading: boolean;
};

export function CreateFoodProductModal({
                                           isOpen,
                                           onClose,
                                           onSubmit,
                                           isLoading
                                       }: Props) {
    const [formData, setFormData] = useState<FoodProductCreateUpdate>({
        productName: '',
        energyKcal: 0,
        fat: 0,
        carbohydrates: 0,
        protein: 0,
        fiber: 0,
        salt: 0,
        foodCategoryId: 0
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getCategories();
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const categoryOptions = categories.map(category => ({
        value: category.categoryId,
        label: category.categoryName
    }));

    useEffect(() => {
        if (isOpen) {
            setFormData({
                productName: '',
                energyKcal: 0,
                fat: 0,
                carbohydrates: 0,
                protein: 0,
                fiber: 0,
                salt: 0,
                foodCategoryId: 0
            });
            setErrors({});
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    const validateField = (name: keyof FoodProductCreateUpdate, value: string | number): string => {
        if (name === 'productName') {
            if (!value) return 'Product name is required';
            if (String(value).length > 100) return 'Product name cannot exceed 100 characters';
        } else if (name === 'foodCategoryId') {
            if (!value || value === 0) return 'Please select a category';
        } else {
            const numValue = Number(value);
            if (name === 'energyKcal') {
                if (numValue < 0 || numValue > 1000) return 'Value must be between 0 and 1000';
            } else {
                if (numValue < 0 || numValue > 100) return 'Value must be between 0 and 100';
            }
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Convert to appropriate type
        const processedValue = type === 'number' ? Number(value) : value;

        // Validate
        const error = validateField(name as keyof FoodProductCreateUpdate, processedValue);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof FoodProductCreateUpdate>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            await onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    const nutritionFields = [
        { name: 'energyKcal', label: 'Energy (kcal)', max: 1000 },
        { name: 'fat', label: 'Fat (g)', max: 100 },
        { name: 'carbohydrates', label: 'Carbohydrates (g)', max: 100 },
        { name: 'protein', label: 'Protein (g)', max: 100 },
        { name: 'fiber', label: 'Fiber (g)', max: 100 },
        { name: 'salt', label: 'Salt (g)', max: 100 }
    ] as const;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div
                className="modal fade show"
                tabIndex={-1}
                style={{ display: 'block' }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New Product</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={isLoading}
                                aria-label="Close"
                            />
                        </div>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="productName" className="form-label">Product Name</label>
                                    <input
                                        id="productName"
                                        type="text"
                                        className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        maxLength={100}
                                        required
                                    />
                                    {errors.productName && (
                                        <div className="invalid-feedback">{errors.productName}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <Select
                                        label="Category"
                                        options={categoryOptions}
                                        name="foodCategoryId"
                                        value={formData.foodCategoryId}
                                        onChange={handleInputChange}
                                        error={errors.foodCategoryId}
                                        fullWidth
                                        required
                                    />
                                </div>

                                <h6 className="mb-3">Nutrition Values (per 100g)</h6>
                                <div className="row">
                                    {nutritionFields.map(field => (
                                        <div key={field.name} className="col-md-4 mb-3">
                                            <label htmlFor={field.name} className="form-label">
                                                {field.label}
                                            </label>
                                            <input
                                                id={field.name}
                                                type="number"
                                                className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                min="0"
                                                max={field.max}
                                                step="0.1"
                                                required
                                            />
                                            {errors[field.name] && (
                                                <div className="invalid-feedback">{errors[field.name]}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button
                                    onClick={onClose}
                                    className="btn btn-subtle"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading && <span className="spinner-border spinner-border-sm me-2" />}
                                    Create Product
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}