import React, { useEffect, useRef, useState } from 'react';
import type { Offer, Product } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { AddToCartBar } from '../../../shared/components';

interface OfferDetailsSheetProps {
  offer: Offer | null;
  featuredProducts?: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export const OfferDetailsSheet: React.FC<OfferDetailsSheetProps> = ({
  offer,
  featuredProducts = [],
  isOpen,
  onClose
}) => {
  const { addItem, addFlyingAnimation } = useCart();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setDragOffset(0);
      // Immediate visibility for faster appearance
      setIsVisible(true);

      // Add browser history entry when sheet opens
      window.history.pushState({ sheetOpen: true }, '');

      // Handle back button press
      const handlePopState = (event: PopStateEvent) => {
        if (event.state?.sheetOpen || !event.state) {
          handleClose();
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = sheetRef.current?.getBoundingClientRect();

    // Allow dragging from anywhere on the sheet
    if (rect) {
      setIsDragging(true);
      setDragStartY(clientY);
      setDragOffset(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const offset = clientY - dragStartY;

    // Only allow downward dragging
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // If dragged down more than 100px, close the sheet
    if (dragOffset > 100) {
      handleClose();
    } else {
      // Snap back to original position
      setDragOffset(0);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDragOffset(0);
    }, 300);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!offer) return;

    e.stopPropagation();

    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const cartPosition = (window as any).cartButtonPosition;
    const endX = cartPosition?.x || startX;
    const endY = cartPosition?.y || startY;

    const animationId = `${offer.id}-${Date.now()}`;

    addFlyingAnimation(animationId, offer.image_url, startX, startY, endX, endY);

    setTimeout(() => {
      addItem({
        id: offer.id.toString(),
        name: offer.title || 'Offer',
        price_in_syp: offer.price_syp,
        price_in_usd: offer.price_usd,
        image_url: offer.image_url,
        type: 'offer',
        quantity: quantity
      });
    }, 100);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  if (!offer) return null;

  const transform = isClosing
    ? 'translateY(100%)'
    : `translateY(${Math.min(dragOffset, 100)}px)`;

  const borderRadius = isClosing ? '0' : '24px 24px 0 0';
  const willChange = isDragging ? 'transform' : 'auto';

  return (
    <>
      {/* Backdrop */}
      {isVisible && !isClosing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 z-40"
          onClick={handleClose}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 top-0 z-50 transition-all duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        style={{ transform, willChange }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Inner container with rounded corners */}
        <div
          className="w-full h-full bg-white shadow-2xl rounded-t-3xl"
          style={{ borderRadius }}
        >
          {/* Content */}
          <div className="relative h-full">
            {/* Image */}
            <div className="relative">
              <img
                src={offer.image_url}
                alt={offer.title}
                className="w-full h-80 object-cover"
              />
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* White container covering bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-lg overflow-hidden" style={{ height: '70%', marginTop: '-20px' }}>
              <div className="p-6 pl-0 pb-24 h-full overflow-y-auto">
                <div className="text-center text-gray-600 font-bold arabic-text text-2xl mb-12">{offer.title}</div>
                <div className="flex justify-start items-start gap-6">
                  <img src="/images/fork.png" alt="Fork" className="w-8 h-8 mt-1" />
                  <div>
                    <div className="text-gray-600 font-semibold arabic-text mb-2">عن العرض</div>
                    <div className="text-gray-500 leading-relaxed arabic-text">
                      {offer.description}
                    </div>
                    <div className="border-t-2 border-gray-300 mt-4 pt-4 -mr-12"></div>

                    {/* Featured Products Section */}
                    <div className="mt-8 -mr-15">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 arabic-text text-left">المنتجات المميزة</h3>
                      <div className="flex flex-col -space-y-10 ">
                        {featuredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="w-full cursor-pointer relative transition-all duration-500 ease-out transform opacity-100 translate-y-0"
                          >
                            <div className="w-full h-36 rounded-xl overflow-hidden flex gap-8">
                              <div className="w-1/5 h-full flex items-center justify-start p-1 pl-0">
                                <div className="relative">
                                  <div className="w-20 h-20 rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                    <img
                                      src={product.images?.[0] || "/images/default-product.png"}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="w-4/5 h-full flex flex-col justify-start pt-10">
                                <h3 className="text-sm font-medium text-black mb-1 arabic-text leading-tight">
                                  {product.name}
                                </h3>
                                <p className="text-xs line-clamp-2 mb-2 arabic-text leading-tight text-gray-600">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Bar */}
            <AddToCartBar
              onAddToCart={handleAddToCart}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              price={offer.price_syp || 0}
              priceCurrency="ل.س"
              buttonText="اضف"
            />
          </div>
        </div>
      </div>
    </>
  );
};
