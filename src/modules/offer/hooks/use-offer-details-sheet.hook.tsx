import { useState, useCallback } from 'react';
import type { Offer } from '../../../shared/types';

export const useOfferDetailsSheet = () => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openOfferDetails = useCallback((offer: Offer) => {
    setSelectedOffer(offer);
    setIsOpen(true);
  }, []);

  const closeOfferDetails = useCallback(() => {
    setIsOpen(false);
    // Clear the selected offer after animation completes
    setTimeout(() => {
      setSelectedOffer(null);
    }, 300);
  }, []);

  return {
    selectedOffer,
    isOpen,
    openOfferDetails,
    closeOfferDetails
  };
};
