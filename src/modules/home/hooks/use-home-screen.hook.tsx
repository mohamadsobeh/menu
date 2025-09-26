import { useMemo } from 'react';
import { useHomeScreenData, homeScreenUtils } from '../services';

export const useHomeScreen = (restaurantId: number) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useHomeScreenData(restaurantId);

  // Memoized computed values
  const computedData = useMemo(() => {
    if (!data) return null;

    return {
      activeBanners: homeScreenUtils.getActiveBanners(data),
      featuredProducts: homeScreenUtils.getFeaturedProducts(data),
      categoriesWithProducts: homeScreenUtils.getCategoriesWithProducts(data),
      sortedCategories: homeScreenUtils.getSortedCategories(data),
      availableProducts: homeScreenUtils.getAvailableProducts(data),
      favoriteProducts: homeScreenUtils.getFavoriteProducts(data),
      whiteLabelConfig: data.label,
    };
  }, [data]);

  // Error message helper
  const errorMessage = useMemo(() => {
    if (!isError || !error) return null;

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unknown error occurred while fetching data';
  }, [isError, error]);

  return {
    // Raw data
    data,

    // Computed data
    activeBanners: computedData?.activeBanners ?? [],
    featuredProducts: computedData?.featuredProducts ?? [],
    categoriesWithProducts: computedData?.categoriesWithProducts ?? [],
    sortedCategories: computedData?.sortedCategories ?? [],
    availableProducts: computedData?.availableProducts ?? [],
    favoriteProducts: computedData?.favoriteProducts ?? [],
    whiteLabelConfig: computedData?.whiteLabelConfig,

    // Loading states
    isLoading,
    isFetching,
    isError,
    errorMessage,

    // Actions
    refetch,

    // Helper functions
    getProductsByCategory: (categoryId: number) =>
      homeScreenUtils.getProductsByCategory(data!, categoryId),

    // Helper flags
    hasData: !!data,
    hasBanners: (computedData?.activeBanners?.length ?? 0) > 0,
    hasFeaturedProducts: (computedData?.featuredProducts?.length ?? 0) > 0,
    hasCategories: (computedData?.categoriesWithProducts?.length ?? 0) > 0,
    hasProducts: (computedData?.availableProducts?.length ?? 0) > 0,
    hasFavorites: (computedData?.favoriteProducts?.length ?? 0) > 0,
  };
};
