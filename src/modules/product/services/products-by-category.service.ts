import { useQuery } from '@tanstack/react-query';
import type { Product, ApiResponse, PaginatedResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';

// Query keys for React Query
export const productsByCategoryKeys = {
    all: ['productsByCategory'] as const,
    lists: () => [...productsByCategoryKeys.all, 'list'] as const,
    list: (categoryId: number, page: number, limit: number) => [...productsByCategoryKeys.lists(), { categoryId, page, limit }] as const,
};

export interface ProductsByCategoryParams {
    categoryId: number;
    page: number;
    limit: number;
}

export const fetchProductsByCategoryData = async (params: ProductsByCategoryParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(`/customer/products/category/${params.categoryId}`, {
        page: params.page.toString(),
        limit: params.limit.toString()
    });
    return response.data;
};

export const useProductsByCategoryData = (params: ProductsByCategoryParams) => {
    return useQuery({
        queryKey: productsByCategoryKeys.list(params.categoryId, params.page, params.limit),
        queryFn: () => fetchProductsByCategoryData(params),
        enabled: !!params.categoryId && !!params.page && !!params.limit,
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
