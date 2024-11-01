import React, {useEffect, useState, useCallback} from 'react';
import {useSearchParams} from 'react-router-dom';
import {FoodProduct} from '../types/foodProduct';
import {FoodProductCard} from './FoodProductCard';
import { SearchForm } from './SearchForm';

export const FoodProductList: React.FC = () => {
    const [foodProducts, setFoodProducts] = useState<FoodProduct[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFoodProducts = useCallback(async (search: string = '') => {
        try {
            if (!initialLoading) {
                setSearchLoading(true);
            }

            const url = search ? `/api/foodproducts?search=${search}` : '/api/foodproducts';
            
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch food products');
            }

            const data = await response.json();
            setFoodProducts(data);
        } catch (error) {
            setError('Error fetching food products');
        } finally {
            setInitialLoading(false);
            setSearchLoading(false);
        }
    }, [initialLoading]);

    const handleSearch = (search: string) => {
        if (search) {
            setSearchParams({search});
        } else {
            setSearchParams({});
        }
    };

    useEffect(() => {
        const searchTerm = searchParams.get('q') || '';
        fetchFoodProducts(searchTerm).then(() => {
            setInitialLoading(false);
        });
    }, [fetchFoodProducts, searchParams]);

    if (error) {
        return (
            <div className='alert alert-danger' role='alert'>
                Error: {error}
            </div>
        );
    }

    return (
        <>
            <SearchForm
                initialSearch={searchParams.get('q') || ''}
                onSearch={handleSearch}
            />

            {initialLoading ? (
                <div className='text-center'>
                    <div className='spinner-border text-primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </div>
                </div>
            ) : (
                <div className={searchLoading ? 'opacity-50' : ''}>
                    <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'>
                        {foodProducts.map((foodProduct) => (
                            <div key={foodProduct.productId} className='col'>
                                <FoodProductCard foodProduct={foodProduct} onDelete={handleDelete}/>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!initialLoading && !searchLoading && foodProducts.length === 0 && (
                <div className='alert alert-info text-center' role='alert'>
                    No food products found
                </div>
            )}
        </>
    );
};