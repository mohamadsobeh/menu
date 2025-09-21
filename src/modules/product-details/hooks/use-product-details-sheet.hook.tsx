import { useState, useCallback } from 'react';
import type { Product } from '../../../shared/types';

export const useProductDetailsSheet = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const openProductDetails = useCallback((product: Product, imageUrl?: string) => {
    setSelectedProduct(product);
    setCategoryImageUrl(imageUrl || '');
    setIsOpen(true);
  }, []);

  const closeProductDetails = useCallback(() => {
    setIsOpen(false);
    // Clear the selected product after animation completes
    setTimeout(() => {
      setSelectedProduct(null);
      setCategoryImageUrl('');
    }, 300);
  }, []);

  return {
    selectedProduct,
    categoryImageUrl,
    isOpen,
    openProductDetails,
    closeProductDetails
  };
};
