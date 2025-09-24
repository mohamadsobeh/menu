import { useQuery } from '@tanstack/react-query';
import type { Product, ApiResponse, PaginatedResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';

// Query keys for React Query
export const favoritesProductsKeys = {
    all: ['favoritesProducts'] as const,
    lists: () => [...favoritesProductsKeys.all, 'list'] as const,
    list: (page: number, limit: number) => [...favoritesProductsKeys.lists(), { page, limit }] as const,
};

export interface FavoritesProductsParams {
    page: number;
    limit: number;
}

export const fetchFavoritesProductsData = async (params: FavoritesProductsParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/customer/products/favorites', {
        page: params.page.toString(),
        limit: params.limit.toString()
    });
    return response.data;
};

export const useFavoritesProductsData = (params: FavoritesProductsParams) => {
    return useQuery({
        queryKey: favoritesProductsKeys.list(params.page, params.limit),
        queryFn: () => fetchFavoritesProductsData(params),
        enabled: !!params.page && !!params.limit,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
            if (failureCount >= 3) return false;
            if (error instanceof Error && error.message.includes('4')) return false;
            return true;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};
