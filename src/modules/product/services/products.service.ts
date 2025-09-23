import { useQuery } from '@tanstack/react-query';
import type { Product, ApiResponse, PaginatedResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';

// Query keys for React Query
export const productsKeys = {
    all: ['products'] as const,
    lists: () => [...productsKeys.all, 'list'] as const,
    list: (page: number, limit: number) => [...productsKeys.lists(), { page, limit }] as const,
};

export interface ProductsParams {
    page: number;
    limit: number;
}

export const fetchProductsData = async (params: ProductsParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/customer/products', {
        page: params.page.toString(),
        limit: params.limit.toString()
    });
    return response.data;
};

export const useProductsData = (params: ProductsParams) => {
    return useQuery({
        queryKey: productsKeys.list(params.page, params.limit),
        queryFn: () => fetchProductsData(params),
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
