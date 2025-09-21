import React from 'react';
import { CheckoutModal } from '../components';

interface CheckoutPageProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  return (
    <CheckoutModal
      isOpen={isOpen}
      onClose={onClose}
      onOrderPlaced={onOrderPlaced}
    />
  );
};
