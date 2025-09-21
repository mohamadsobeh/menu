import React from "react";
import { CheckoutModal } from "../../modules/checkout";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (orderId: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  onOrderPlaced
}) => {
  return (
    <CheckoutModal
      isOpen={isOpen}
      onClose={onClose}
      onOrderPlaced={onOrderPlaced}
    />
  );
};