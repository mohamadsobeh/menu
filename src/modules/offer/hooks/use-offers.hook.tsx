import { useState, useMemo } from 'react';
import { useOffersData } from '../services';

export interface UseOffersParams {
    initialPage?: number;
    initialLimit?: number;
}

export const useOffers = ({
    initialPage = 1,
    initialLimit = 10
}: UseOffersParams = {}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit] = useState(initialLimit);

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch,
    } = useOffersData({ page: currentPage, limit });

    // Memoized computed values
    const computedData = useMemo(() => {
        if (!data) return null;

        return {
            offers: data.data,
            pagination: data.meta,
            hasOffers: data.data.length > 0,
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

        return 'An unknown error occurred while fetching offers';
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
        hasOffers: computedData?.hasOffers || false,

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
