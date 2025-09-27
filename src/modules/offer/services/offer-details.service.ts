import { useQuery } from '@tanstack/react-query';
import type { Offer, Product, ApiResponse, PaginatedResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';
import { mapOffers } from './offer-mapper';

// Query keys for React Query
export const offerDetailsKeys = {
    all: ['offerDetails'] as const,
    detail: (id: number) => [...offerDetailsKeys.all, 'detail', id] as const,
};

export interface OfferDetailsResponse {
    offer: Offer;
    featuredProducts: Product[];
}

// Since the backend doesn't have a /customer/offers/{id} endpoint,
// we'll fetch all offers and find the specific one by ID
export const fetchOfferDetails = async (offerId: number): Promise<OfferDetailsResponse> => {
    // Fetch all offers and find the specific one
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>('/customer/offers', {
        page: '1',
        limit: '100' // Get a large number to ensure we find the offer
    });

    // Apply mapper to transform API response
    const mappedOffers = mapOffers(response.data.data);

    // Find the specific offer by ID
    const targetOffer = mappedOffers.find(offer => offer.id === offerId);

    if (!targetOffer) {
        throw new Error(`Offer with ID ${offerId} not found`);
    }

    return {
        offer: targetOffer,
        featuredProducts: targetOffer.products || []
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
