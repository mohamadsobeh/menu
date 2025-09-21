import { useQuery } from '@tanstack/react-query';
import type { HomeScreenResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';

// Query keys for React Query
export const homeScreenKeys = {
  all: ['home-screen'] as const,
  details: (userId: string) => [...homeScreenKeys.all, userId] as const,
};

export const fetchHomeScreenData = async (userId: string): Promise<HomeScreenResponse> => {
  return apiClient.get<HomeScreenResponse>('/get-home-screen', { user_id: userId });
};

export const useHomeScreenData = (userId: string) => {
  return useQuery({
    queryKey: homeScreenKeys.details(userId),
    queryFn: () => fetchHomeScreenData(userId),
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error instanceof Error && error.message.includes('4')) return false;
      return true;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// Utility functions for data transformation
export const homeScreenUtils = {
  // Get active banners only, sorted by display order
  getActiveBanners: (data: HomeScreenResponse) => {
    return data.banners
      .filter(banner => banner.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  },

  // Get recommended offers
  getRecommendedOffers: (data: HomeScreenResponse) => {
    return data.offers.filter(offer => offer.is_recommended);
  },

  // Get featured products
  getFeaturedProducts: (data: HomeScreenResponse) => {
    return data.featured_products || [];
  },

  // Get all offers (both regular offers and featured products)
  getAllOffers: (data: HomeScreenResponse) => {
    const regularOffers = data.offers || [];
    const featuredProducts = data.featured_products || [];
    return [...regularOffers, ...featuredProducts];
  },

  // Get categories with products
  getCategoriesWithProducts: (data: HomeScreenResponse) => {
    return data.categories.filter(category => category.products.length > 0);
  },

  // Get available products from all categories
  getAvailableProducts: (data: HomeScreenResponse) => {
    return data.categories.flatMap(category => 
      category.products.filter(product => product.is_available)
    );
  },

  // Get favorite products
  getFavoriteProducts: (data: HomeScreenResponse) => {
    return data.categories.flatMap(category => 
      category.products.filter(product => product.isfav)
    );
  },

  // Get products by category
  getProductsByCategory: (data: HomeScreenResponse, categoryId: string) => {
    const category = data.categories.find(cat => cat.id === categoryId);
    return category?.products || [];
  },

  // Get categories sorted by display order
  getSortedCategories: (data: HomeScreenResponse) => {
    return data.categories.sort((a, b) => a.display_order - b.display_order);
  },
};
