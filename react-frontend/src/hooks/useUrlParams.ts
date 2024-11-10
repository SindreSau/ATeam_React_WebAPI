// hooks/useUrlParams.ts
import { useSearchParams } from 'react-router-dom';
import usePersistedState from './usePersistedState';

interface UseUrlParamsResult {
    currentPage: number;
    pageSize: number;
    orderBy: string;
    nokkelhull?: boolean;
    searchTerm: string;
    updateSearchParams: (updates: Record<string, string | null>) => void;
    setPageSize: (size: number) => void;
}

export const useUrlParams = (pageSizeOptions: number[]): UseUrlParamsResult => {
    const [searchParams, setSearchParams] = useSearchParams();

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

    const updateSearchParams = (updates: Record<string, string | null>) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === undefined) {
                    newParams.delete(key);
                } else {
                    newParams.set(key, value);
                }
            });
            return newParams;
        });
    };

    return {
        currentPage,
        pageSize,
        orderBy,
        nokkelhull,
        searchTerm: searchParams.get('search') || '',
        updateSearchParams,
        setPageSize
    };
};