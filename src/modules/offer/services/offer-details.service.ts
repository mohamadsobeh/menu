import { useQuery } from '@tanstack/react-query';
import type { Offer, Product, ApiResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';
import { mapOffer, mapProducts } from './offer-mapper';

// Query keys for React Query
export const offerDetailsKeys = {
    all: ['offerDetails'] as const,
    detail: (id: number) => [...offerDetailsKeys.all, 'detail', id] as const,
};

export interface OfferDetailsResponse {
    offer: Offer;
    featuredProducts: Product[];
}

export const fetchOfferDetails = async (offerId: number): Promise<OfferDetailsResponse> => {
    const response = await apiClient.get<ApiResponse<any>>(`/customer/offers/${offerId}`);

    // Apply mappers to transform API response
    const mappedOffer = mapOffer(response.data.offer);
    const mappedFeaturedProducts = mapProducts(response.data.featuredProducts || []);

    return {
        offer: mappedOffer,
        featuredProducts: mappedFeaturedProducts
    };
};

export const useOfferDetails = (offerId: number | null, enabled: boolean = true) => {
    return useQuery({
        queryKey: offerDetailsKeys.detail(offerId!),
        queryFn: () => fetchOfferDetails(offerId!),
        enabled: enabled && !!offerId,
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
