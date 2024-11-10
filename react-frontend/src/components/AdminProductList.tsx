// src/components/AdminProductList.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FoodProduct } from '../types/foodProduct';
import { fetchFoodProducts, updateFoodProduct } from '../services/foodProductService';
import { FoodProductCard } from './FoodProductCard';
import { SearchForm } from './SearchForm';
import { CardEditModal } from './CardEditModal';
import PaginationController from "./PaginationController";
import Spinner from "./Spinner";
import usePersistedState from "../hooks/usePersistedState";

export const AdminProductList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [foodProducts, setFoodProducts] = useState<FoodProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentFoodProductCard, setCurrentFoodProductCard] = useState<FoodProduct | null>(null);
    const pageSizeOptions = [2, 5, 10, 15];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(() =>
        Number(searchParams.get('page')) || 1
    );

    const [pageSize, setPageSize] = usePersistedState(
        'preferredPageSize',
        pageSizeOptions[0]
    );

    // Effect to sync persisted pageSize state with URL
    useEffect(() => {
        const urlPageSize = Number(searchParams.get('pageSize'));
        if (urlPageSize && pageSizeOptions.includes(urlPageSize)) {
            setPageSize(urlPageSize);
        } else if (pageSize !== pageSizeOptions[0]) {
            // If no valid URL pageSize, update URL with current pageSize
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('pageSize', pageSize.toString());
                return newParams;
            });
        }
    }, [searchParams, pageSize, setPageSize, setSearchParams, pageSizeOptions]);

    const openModal = (foodProductCard: FoodProduct) => {
        setCurrentFoodProductCard(foodProductCard);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentFoodProductCard(null);
    };

    const handleUpdate = async (updatedProduct: FoodProduct) => {
        try {
            await updateFoodProduct(updatedProduct);
            setFoodProducts(prev =>
                prev.map(p => p.productId === updatedProduct.productId ? updatedProduct : p)
            );
        } catch (error) {
            setError('Error updating food product');
        }
    };

    const handleDelete = async (productId: number) => {
        try {
            const response = await fetch(`/api/foodproducts/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setFoodProducts(products =>
                    products.filter(p => p.productId !== productId)
                );
                setTotalCount(prev => prev - 1);
            }
        } catch (error) {
            setError('Error deleting food product');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', page.toString());
            return newParams;
        });
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('pageSize', newPageSize.toString());
            newParams.set('page', '1');
            return newParams;
        });
    };

    const handleSearch = (search: string) => {
        setCurrentPage(1); // Reset to first page on new search
        setSearchParams({
            search,
            page: '1',
            pageSize: pageSize.toString()
        });
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const searchTerm = searchParams.get('search') || '';
                const response = await fetchFoodProducts(searchTerm, {
                    pageNumber: currentPage,
                    pageSize: pageSize
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
    }, [searchParams, currentPage, pageSize]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        // TODO: Replace this with toast or alert component
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <SearchForm
                initialSearch={searchParams.get('search') || ''}
                onSearch={handleSearch}
            />

            <div className="row">
                {foodProducts.map(product => (
                    <div key={product.productId} className="col-md-4 mb-4">
                        <FoodProductCard
                            foodProduct={product}
                            onEdit={() => openModal(product)}
                            onDelete={handleDelete}
                        />
                    </div>
                ))}
            </div>

            {foodProducts.length === 0 && (
                <div className="text-center my-4">No products found</div>
            )}

            {totalCount > 0 && (
                <PaginationController
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / pageSize)}
                    pageSize={pageSize}
                    totalItems={totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={pageSizeOptions}
                />
            )}

            {modalOpen && currentFoodProductCard && (
                <CardEditModal
                    foodProduct={currentFoodProductCard}
                    show={modalOpen}
                    onClose={closeModal}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
};