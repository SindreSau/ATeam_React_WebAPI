import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { FoodProduct, FoodProductCreate } from '../types/foodProduct';
import { SearchForm } from './SearchForm';
import { FoodProductCard } from './FoodProductCard';
import PaginationController from './PaginationController';
import Spinner from './Spinner';
import { Button } from './Button';
import { CreateFoodProductModal } from './CreateFoodProductModal';
import { NokkelhullFilter } from './NokkelHullFilter';
import { ProductSort } from './ProductSort';
import usePersistedState from '../hooks/usePersistedState';

interface ProductQueryParams {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
    orderBy: string;
    nokkelhull?: boolean;
}

export const VendorProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageSizeOptions = [2, 5, 10, 15];
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Get URL parameters
    const currentPage = Number(searchParams.get('page')) || 1;
    const orderBy = searchParams.get('orderBy') || 'createdat_desc';
    const nokkelhullParam = searchParams.get('nokkelhull');
    const nokkelhull: boolean | undefined = nokkelhullParam ? nokkelhullParam === 'true' : undefined;

    const urlPageSize = Number(searchParams.get('pageSize'));
    const validUrlPageSize = pageSizeOptions.includes(urlPageSize) ? urlPageSize : null;

    const [pageSize, setPageSize] = usePersistedState(
        'vendorPreferredPageSize',
        pageSizeOptions[0],
        validUrlPageSize
    );

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (newProduct: FoodProductCreate) =>
            productsApi.createProduct(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
            setIsCreateModalOpen(false);
        }
    });

    // Products query with all parameters
    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['vendorProducts', {
            pageNumber: currentPage,
            pageSize,
            searchTerm: searchParams.get('search') || '',
            orderBy,
            nokkelhull
        }],
        queryFn: () => {
            const params: ProductQueryParams = {
                pageNumber: currentPage,
                pageSize,
                searchTerm: searchParams.get('search') || '',
                orderBy,
                nokkelhull
            };
            return productsApi.getVendorProducts(params);
        },
        select: (response) => response.data
    });

    const handleCreateProduct = async (data: FoodProductCreate) => {
        try {
            await createMutation.mutateAsync(data);
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    const updateSearchParams = (updates: Record<string, string>) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value === undefined || value === null) {
                    newParams.delete(key);
                } else {
                    newParams.set(key, value);
                }
            });
            return newParams;
        });
    };

    const handlePageChange = (page: number) => {
        updateSearchParams({ page: page.toString() });
    };

    const handlePageSizeChange = (newPageSize: number) => {
        updateSearchParams({
            pageSize: newPageSize.toString(),
            page: '1'
        });
        setPageSize(newPageSize);
    };

    const handleSearch = (search: string) => {
        updateSearchParams({
            search,
            page: '1'
        });
    };

    const handleSort = (value: string) => {
        updateSearchParams({
            orderBy: value,
            page: '1'
        });
    };

    const handleNokkelhullFilter = (value: boolean | null) => {
        if (value === null) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('nokkelhull');
                newParams.set('page', '1');
                return newParams;
            });
        } else {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('nokkelhull', value.toString());
                newParams.set('page', '1');
                return newParams;
            });
        }
    };

    if (isLoading) return <Spinner />;
    if (isError) return <div className="alert alert-danger">Error: {(error as Error).message}</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">My Products</h1>

                <div className="d-flex gap-3 align-items-center">
                    <ProductSort value={orderBy} onChange={handleSort} />
                    <NokkelhullFilter
                        value={nokkelhull === undefined ? null : nokkelhull}
                        onChange={handleNokkelhullFilter}
                    />
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <i className="fa fa-plus-circle me-2"></i>
                        Add New Product
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <SearchForm
                    initialSearch={searchParams.get('search') || ''}
                    onSearch={handleSearch}
                />
            </div>

            <div className="row g-4">
                {data?.items.map((product: FoodProduct) => (
                    <div key={product.productId} className="col-12 col-md-6 col-lg-4">
                        <FoodProductCard
                            foodProduct={product}
                            onEdit={() => {/* TODO: Implement edit functionality */}}
                            onDelete={() => {/* TODO: Implement delete functionality */}}
                        />
                    </div>
                ))}
            </div>

            {data?.items.length === 0 && (
                <div className="text-center my-4">No products found</div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
                {data && data.totalCount > 0 && (
                    <PaginationController
                        currentPage={currentPage}
                        totalPages={data.totalPages}
                        pageSize={pageSize}
                        totalItems={data.totalCount}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={pageSizeOptions}
                    />
                )}

                <div className="text-muted">
                    Total items: {data?.totalCount || 0}
                </div>
            </div>

            <CreateFoodProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateProduct}
                isLoading={createMutation.isPending}
            />
        </div>
    );
}