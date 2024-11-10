import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FoodProductCreate } from '../types/foodProduct';
import { categoriesApi } from '../api/categories';
import { Button } from './Button';

type FormErrors = Partial<Record<keyof FoodProductCreate, string>>;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FoodProductCreate) => Promise<void>;
    isLoading: boolean;
};

export function CreateFoodProductModal({
                                           isOpen,
                                           onClose,
                                           onSubmit,
                                           isLoading
                                       }: Props) {
    const [formData, setFormData] = useState<FoodProductCreate>({
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

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getCategories();
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache before refetch
    });

    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
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

            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scrolling when modal is closed
            document.body.style.overflow = 'unset';
        }

        // Cleanup effect
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateField = (name: keyof FoodProductCreate, value: string | number): string => {
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
        const error = validateField(name as keyof FoodProductCreate, processedValue);

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

        (Object.keys(formData) as Array<keyof FoodProductCreate>).forEach(key => {
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
            <div
                className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div className="modal-dialog modal-lg">
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
                                    <label htmlFor="foodCategoryId" className="form-label">Category</label>
                                    <select
                                        id="foodCategoryId"
                                        className={`form-select ${errors.foodCategoryId ? 'is-invalid' : ''}`}
                                        name="foodCategoryId"
                                        value={formData.foodCategoryId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="0">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.foodCategoryId && (
                                        <div className="invalid-feedback">{errors.foodCategoryId}</div>
                                    )}
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
                                    variant="secondary"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    isLoading={isLoading}
                                >
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