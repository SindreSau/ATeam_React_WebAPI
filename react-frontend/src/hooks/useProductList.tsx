// src/hooks/useProductList.ts
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import usePersistedState from './usePersistedState';
import { useMemo, useCallback } from 'react';
import {PAGE_SIZE_OPTIONS} from "../config/constants";

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

    // Memoize the current state values
    const currentState = useMemo(() => ({
        currentPage: Number(searchParams.get('page')) || 1,
        orderBy: searchParams.get('orderBy') || 'createdat_desc',
        nokkelhull: searchParams.get('nokkelhull') ? searchParams.get('nokkelhull') === 'true' : undefined,
        search: searchParams.get('search') || '',
    }), [searchParams]);

    // Memoize pageSizeOptions
    const pageSizeOptions = useMemo(() => PAGE_SIZE_OPTIONS, []);


    // Memoize URL pageSize validation
    const validUrlPageSize = useMemo(() => {
        const urlPageSize = Number(searchParams.get('pageSize'));
        return pageSizeOptions.includes(urlPageSize) ? urlPageSize : null;
    }, [searchParams, pageSizeOptions]);

    // Persisted pageSize state
    const [pageSize, setPageSize] = usePersistedState(
        storageKey,
        pageSizeOptions[1],
        validUrlPageSize
    );

    // Memoize query parameters
    const queryParams = useMemo<ProductListParams>(() => ({
        pageNumber: currentState.currentPage,
        pageSize,
        searchTerm: currentState.search,
        orderBy: currentState.orderBy,
        nokkelhull: currentState.nokkelhull
    }), [currentState, pageSize]);

    // Query
    const queryResult = useQuery({
        queryKey: [`${mode}Products`, queryParams],
        queryFn: () => mode === 'admin'
            ? productsApi.getAdminProducts(queryParams)
            : productsApi.getVendorProducts(queryParams),
        select: (response) => response.data
    });

    // Memoized update helper
    const updateSearchParams = useCallback((updates: Record<string, string>) => {
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
    }, [setSearchParams]);

    // Memoized handlers
    const handlePageChange = useCallback((page: number) => {
        updateSearchParams({ page: page.toString() });
    }, [updateSearchParams]);

    const handlePageSizeChange = useCallback((newPageSize: number) => {
        updateSearchParams({
            pageSize: newPageSize.toString(),
            page: '1'
        });
        setPageSize(newPageSize);
    }, [updateSearchParams, setPageSize]);

    const handleSearch = useCallback((search: string) => {
        updateSearchParams({
            search,
            page: '1'
        });
    }, [updateSearchParams]);

    const handleSort = useCallback((value: string) => {
        updateSearchParams({
            orderBy: value,
            page: '1'
        });
    }, [updateSearchParams]);

    const handleNokkelhullFilter = useCallback((value: boolean | null) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (value === null) {
                newParams.delete('nokkelhull');
            } else {
                newParams.set('nokkelhull', value.toString());
            }
            newParams.set('page', '1');
            return newParams;
        });
    }, [setSearchParams]);

    return {
        // Data and loading states
        data: queryResult.data,
        isLoading: queryResult.isLoading,
        isFetching: queryResult.isFetching,
        isError: queryResult.isError,
        error: queryResult.error,

        // Current state
        currentPage: currentState.currentPage,
        orderBy: currentState.orderBy,
        nokkelhull: currentState.nokkelhull,
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