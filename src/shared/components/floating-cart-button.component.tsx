import React, { useState } from 'react';
import { useCart } from '../contexts';
import { formatSYPPrice } from '../utils';
import { CartModal } from './cart-modal.component';
import type { WhiteLabelConfig } from '../types';

interface FloatingCartButtonProps {
  whiteLabelConfig?: WhiteLabelConfig | null;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ whiteLabelConfig }) => {
  const { getTotalPrice, getItemCount } = useCart();
  const totalPrice = getTotalPrice();
  const itemCount = getItemCount();
  const cartButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  React.useEffect(() => {
    if (cartButtonRef.current && itemCount > 0) {
      const rect = cartButtonRef.current.getBoundingClientRect();
      (window as any).cartButtonPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }, [itemCount]);

  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <button
          ref={cartButtonRef}
          onClick={handleCartClick}
          className="w-full text-white py-3 px-8 rounded-full shadow-lg flex items-center justify-center gap-4 arabic-text font-semibold text-lg transition-colors duration-200"
          style={{
            backgroundColor: whiteLabelConfig?.primaryColor || '#50BF63',
            fontFamily: whiteLabelConfig?.fontFamily || 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = whiteLabelConfig?.accentColor || '#45a556';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = whiteLabelConfig?.primaryColor || '#50BF63';
          }}
        >
          <span>رؤية السلة</span>
          <span>{formatSYPPrice(totalPrice)}</span>
        </button>
      </div>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </>
  );
};
