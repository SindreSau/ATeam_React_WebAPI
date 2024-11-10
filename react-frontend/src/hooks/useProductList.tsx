// src/hooks/useProductList.ts
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import usePersistedState from './usePersistedState';

export type ProductListMode = 'admin' | 'vendor';

interface UseProductListProps {
    mode: ProductListMode;
    storageKey: string;
}

interface ProductListParams {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
    orderBy: string;
    nokkelhull?: boolean;
}

export const useProductList = ({ mode, storageKey }: UseProductListProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageSizeOptions = [2, 5, 10, 15];

    // Get URL parameters
    const currentPage = Number(searchParams.get('page')) || 1;
    const orderBy = searchParams.get('orderBy') || 'createdat_desc';
    const nokkelhullParam = searchParams.get('nokkelhull');
    const nokkelhull: boolean | undefined = nokkelhullParam ? nokkelhullParam === 'true' : undefined;

    const urlPageSize = Number(searchParams.get('pageSize'));
    const validUrlPageSize = pageSizeOptions.includes(urlPageSize) ? urlPageSize : null;

    const [pageSize, setPageSize] = usePersistedState(
        storageKey,
        pageSizeOptions[0],
        validUrlPageSize
    );

    // Products query
    const queryParams: ProductListParams = {
        pageNumber: currentPage,
        pageSize,
        searchTerm: searchParams.get('search') || '',
        orderBy,
        nokkelhull
    };

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: [`${mode}Products`, queryParams],
        queryFn: () => {
            return mode === 'admin'
                ? productsApi.getAdminProducts(queryParams)
                : productsApi.getVendorProducts(queryParams);
        },
        select: (response) => response.data
    });

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

    return {
        // State
        data,
        isLoading,
        isError,
        error,

        // Params
        currentPage,
        orderBy,
        nokkelhull,
        pageSize,
        pageSizeOptions,
        searchParams,

        // Handlers
        handlePageChange,
        handlePageSizeChange,
        handleSearch,
        handleSort,
        handleNokkelhullFilter,
    };
};