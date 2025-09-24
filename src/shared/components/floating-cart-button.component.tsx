import React, { useState } from 'react';
import { useCart } from '../contexts';
import { formatSYPPrice } from '../utils';
import { CartModal } from './cart-modal.component';

export const FloatingCartButton: React.FC = () => {
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
          className="w-full bg-[#50BF63] text-white py-3 px-8 rounded-full shadow-lg flex items-center justify-center gap-4 arabic-text font-semibold text-lg hover:bg-[#45a556] transition-colors duration-200"
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
