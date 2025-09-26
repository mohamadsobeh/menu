import { useQuery } from '@tanstack/react-query';
import type { HomeScreenResponse, ApiResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils';

// Query keys for React Query
export const homeScreenKeys = {
  all: ['home-screen'] as const,
  details: (userId: string) => [...homeScreenKeys.all, userId] as const,
};

export const fetchHomeScreenData = async (restaurantId: number): Promise<HomeScreenResponse> => {
  const response = await apiClient.get<ApiResponse<HomeScreenResponse>>('/customer/home', { restaurantId: restaurantId.toString() });
  return response.data;
};

export const useHomeScreenData = (restaurantId: number) => {
  return useQuery({
    queryKey: homeScreenKeys.details(restaurantId.toString()),
    queryFn: () => fetchHomeScreenData(restaurantId),
    enabled: !!restaurantId,
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
      .filter(banner => banner.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },


  // Get featured products
  getFeaturedProducts: (data: HomeScreenResponse) => {
    return data.featured_products || [];
  },


  // Get categories with products
  getCategoriesWithProducts: (data: HomeScreenResponse) => {
    return data.categories.filter(category => category.products.length > 0);
  },

  // Get available products from all categories
  getAvailableProducts: (data: HomeScreenResponse) => {
    return data.categories.flatMap(category =>
      category.products.filter(product => product.isAvailable)
    );
  },

  // Get favorite products
  getFavoriteProducts: (data: HomeScreenResponse) => {
    return data.categories.flatMap(category =>
      category.products.filter(product => product.isFav)
    );
  },

  // Get products by category
  getProductsByCategory: (data: HomeScreenResponse, categoryId: number) => {
    const category = data.categories.find(cat => cat.id === categoryId);
    return category?.products || [];
  },

  // Get categories sorted by display order
  getSortedCategories: (data: HomeScreenResponse) => {
    return data.categories.sort((a, b) => a.displayOrder - b.displayOrder);
  },
};
