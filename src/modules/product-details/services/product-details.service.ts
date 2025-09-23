import { useQuery } from '@tanstack/react-query';
import type { Product, ApiResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';

// Query keys for React Query
export const productDetailsKeys = {
    all: ['productDetails'] as const,
    details: (id: number) => [...productDetailsKeys.all, 'detail', id] as const,
};

export const fetchProductDetailsData = async (productId: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/customer/products/${productId}`);
    return response.data;
};

export const useProductDetailsData = (productId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: productDetailsKeys.details(productId),
        queryFn: () => fetchProductDetailsData(productId),
        enabled: enabled && !!productId,
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
