import { useState, useMemo, useCallback } from 'react';
import { useProductDetailsData } from '../services';
import type { Product } from '../../../shared/types';

export interface UseProductDetailsParams {
    productId?: number;
    enabled?: boolean;
}

export const useProductDetails = ({
    productId,
    enabled = true
}: UseProductDetailsParams = {}) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [categoryImageUrl, setCategoryImageUrl] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);

    const {
        data: apiProduct,
        isLoading,
        isError,
        error,
        isFetching,
        refetch,
    } = useProductDetailsData(productId || 0, enabled && !!productId);

    // Memoized computed values
    const computedData = useMemo(() => {
        if (!apiProduct) return null;

        return {
            product: apiProduct,
            hasProduct: !!apiProduct,
        };
    }, [apiProduct]);

    // Error message helper
    const errorMessage = useMemo(() => {
        if (!isError || !error) return null;

        if (error instanceof Error) {
            return error.message;
        }

        return 'An unknown error occurred while fetching product details';
    }, [isError, error]);

    // Open product details with API data
    const openProductDetails = useCallback((product: Product, imageUrl?: string) => {
        setSelectedProduct(product);
        setCategoryImageUrl(imageUrl || '');
        setIsOpen(true);
    }, []);

    // Open product details by ID (fetches from API)
    const openProductDetailsById = useCallback((id: number, imageUrl?: string) => {
        setCategoryImageUrl(imageUrl || '');
        setIsOpen(true);
        // The API data will be used when available
    }, []);

    const closeProductDetails = useCallback(() => {
        setIsOpen(false);
        // Clear the selected product after animation completes
        setTimeout(() => {
            setSelectedProduct(null);
            setCategoryImageUrl('');
        }, 300);
    }, []);

    // Use API product if available, otherwise use selected product
    const currentProduct = computedData?.product || selectedProduct;

    return {
        // Product data
        product: currentProduct,
        apiProduct: computedData?.product,
        selectedProduct,
        categoryImageUrl,

        // Loading states
        isLoading,
        isFetching,
        isError,
        errorMessage,

        // Sheet state
        isOpen,

        // Actions
        openProductDetails,
        openProductDetailsById,
        closeProductDetails,
        refetch,

        // Helper flags
        hasProduct: !!currentProduct,
        hasApiProduct: !!computedData?.product,
    };
};
