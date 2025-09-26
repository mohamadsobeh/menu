import { useQuery } from '@tanstack/react-query';
import type { Offer, ApiResponse, PaginatedResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';
import { mapOffers } from './offer-mapper';

// Query keys for React Query
export const recommendedOffersKeys = {
    all: ['recommended-offers'] as const,
    lists: () => [...recommendedOffersKeys.all, 'list'] as const,
    list: (page: number, limit: number) => [...recommendedOffersKeys.lists(), { page, limit }] as const,
};

export interface RecommendedOffersParams {
    page: number;
    limit: number;
}

export const fetchRecommendedOffersData = async (params: RecommendedOffersParams): Promise<PaginatedResponse<Offer>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>('/customer/offers/recommended', {
        page: params.page.toString(),
        limit: params.limit.toString()
    });

    // Apply mapper to transform API response
    const mappedData = mapOffers(response.data.data);

    return {
        data: mappedData,
        meta: response.data.meta
    };
};

export const useRecommendedOffersData = (params: RecommendedOffersParams) => {
    return useQuery({
        queryKey: recommendedOffersKeys.list(params.page, params.limit),
        queryFn: () => fetchRecommendedOffersData(params),
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
