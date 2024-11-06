import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {FoodProduct} from '../types/foodProduct';
import {fetchFoodProducts} from '../services/foodProductService';
import {FoodProductCard} from './FoodProductCard';
import {SearchForm} from './SearchForm';

export const FoodProductList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [foodProducts, setFoodProducts] = useState<FoodProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);

    const handleDelete = async (productId: number) => {
        try {
            const response = await fetch(`/api/foodproducts/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setFoodProducts(products => products.filter(p => p.productId !== productId));
            }
        } catch (error) {
            setError('Error deleting food product');
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const searchTerm = searchParams.get('search') || '';
                const response = await fetchFoodProducts(searchTerm, {
                    pageNumber: 1,
                    pageSize: 10
                });
                setFoodProducts(response.items);
                setTotalCount(response.totalCount);
            } catch (err) {
                setError('Failed to load food products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [searchParams]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <SearchForm 
                initialSearch={searchParams.get('search') || ''} 
                onSearch={(search) => setSearchParams({ search })}
            />
            <div className="row">
                {foodProducts.map(product => (
                    <div key={product.productId} className="col-md-4 mb-4">
                        <FoodProductCard 
                            foodProduct={product} 
                            onDelete={handleDelete} 
                        />
                    </div>
                ))}
            </div>
            {foodProducts.length === 0 && (
                <div>No products found</div>
            )}
        </div>
    );
};