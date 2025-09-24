import { useQuery } from '@tanstack/react-query';
import type { Offer, ApiResponse, PaginatedResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';

// Query keys for React Query
export const offersKeys = {
    all: ['offers'] as const,
    lists: () => [...offersKeys.all, 'list'] as const,
    list: (page: number, limit: number) => [...offersKeys.lists(), { page, limit }] as const,
};

export interface OffersParams {
    page: number;
    limit: number;
}

export const fetchOffersData = async (params: OffersParams): Promise<PaginatedResponse<Offer>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Offer>>>('/customer/offers', {
        page: params.page.toString(),
        limit: params.limit.toString()
    });
    return response.data;
};

export const useOffersData = (params: OffersParams) => {
    return useQuery({
        queryKey: offersKeys.list(params.page, params.limit),
        queryFn: () => fetchOffersData(params),
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
