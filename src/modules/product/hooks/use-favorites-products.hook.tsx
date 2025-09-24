import { useState, useMemo } from 'react';
import { useFavoritesProductsData } from '../services';

export interface UseFavoritesProductsParams {
    initialPage?: number;
    initialLimit?: number;
}

export const useFavoritesProducts = ({
    initialPage = 1,
    initialLimit = 10
}: UseFavoritesProductsParams = {}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit] = useState(initialLimit);

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch,
    } = useFavoritesProductsData({ page: currentPage, limit });

    // Memoized computed values
    const computedData = useMemo(() => {
        if (!data) return null;

        return {
            products: data.data,
            pagination: data.meta,
            hasProducts: data.data.length > 0,
        };
    }, [data]);

    // Navigation functions
    const goToPage = (page: number) => {
        if (page >= 1 && page <= (computedData?.pagination.totalPages || 1)) {
            setCurrentPage(page);
        }
    };

    const goToNextPage = () => {
        if (computedData?.pagination.hasNext) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPrevPage = () => {
        if (computedData?.pagination.hasPrev) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        if (computedData?.pagination.totalPages) {
            setCurrentPage(computedData.pagination.totalPages);
        }
    };

    // Error message helper
    const errorMessage = useMemo(() => {
        if (!isError || !error) return null;

        if (error instanceof Error) {
            return error.message;
        }

        return 'An unknown error occurred while fetching favorite products';
    }, [isError, error]);

    return {
        // Raw data
        data,
        computedData,

        // Loading states
        isLoading,
        isFetching,
        isError,
        errorMessage,

        // Pagination
        currentPage,
        pagination: computedData?.pagination,
        hasProducts: computedData?.hasProducts || false,

        // Navigation functions
        goToPage,
        goToNextPage,
        goToPrevPage,
        goToFirstPage,
        goToLastPage,

        // Actions
        refetch,
    };
};
