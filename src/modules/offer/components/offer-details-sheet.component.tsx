import React, { useEffect, useRef, useState } from 'react';
import type { Offer, Product } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { AddToCartBar } from '../../../shared/components';
import { useOfferDetails } from '../services';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

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
  const { textColor, backgroundColor, primaryColor } = useWhiteLabelColors();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ✅ جلب البيانات من API
  const { data: offerDetailsData } = useOfferDetails(offer?.id || null, isOpen);
  const displayOffer = offerDetailsData?.offer || offer;
  const displayFeaturedProducts = offerDetailsData?.featuredProducts || featuredProducts;

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setDragOffset(0);
      setIsVisible(true);

      window.history.pushState({ sheetOpen: true }, '');
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
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 100) {
      handleClose();
    } else {
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
    if (!displayOffer) return;
    e.stopPropagation();

    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const cartPosition = (window as any).cartButtonPosition;
    const endX = cartPosition?.x || startX;
    const endY = cartPosition?.y || startY;

    const animationId = `${displayOffer.id}-${Date.now()}`;
    addFlyingAnimation(
      animationId,
      displayOffer.image_url || '/images/default-offer.png',
      startX,
      startY,
      endX,
      endY
    );

    setTimeout(() => {
      addItem({
        id: displayOffer.id.toString(),
        name: displayOffer.title || 'عرض بدون عنوان',
        price_in_syp: displayOffer.price_syp,
        price_in_usd: displayOffer.price_usd,
        image_url: displayOffer.image_url || '/images/default-offer.png',
        type: 'offer',
        quantity: quantity
      });

      setToastMessage('✅ تمت إضافة العرض إلى السلة');
      setTimeout(() => setToastMessage(null), 2000);
    }, 100);
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prev => (increment ? prev + 1 : Math.max(1, prev - 1)));
  };

  if (!offer) return null;

  const transform = isClosing
    ? 'translateY(100%)'
    : `translateY(${Math.min(dragOffset, 100)}px)`;
  const borderRadius = isClosing ? '0' : '24px 24px 0 0';
  const willChange = isDragging ? 'transform' : 'auto';

  return (
    <>
      {/* ✅ Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-lg z-[100] arabic-text text-sm"
          style={{ backgroundColor: primaryColor }}
        >
          {toastMessage}
        </div>
      )}

      {/* ✅ Backdrop */}
      {isVisible && !isClosing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40"
          onClick={handleClose}
        />
      )}

      {/* ✅ Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 top-0 z-50 transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
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
        {/* ✅ Inner Container */}
        <div
          className="w-full h-full shadow-2xl rounded-t-3xl"
          style={{ backgroundColor, borderRadius, color: textColor }}
        >
          <div className="relative h-full">
            {/* ✅ Image */}
            <div className="relative">
              <img
                src={displayOffer?.image_url || '/images/default-offer.png'}
                alt={displayOffer?.title || 'عرض بدون عنوان'}
                className="w-full object-cover"
                style={{
                  height: '434px',
                  borderRadius: '0 0 8px 8px',
                  objectPosition:
                    typeof window !== 'undefined' && window.innerWidth < 400
                      ? 'center -80px'
                      : 'center -160px'
                }}
              />
              <button
                onClick={handleClose}
                className="absolute top-6 sm:top-10 left-4 w-8 h-8 sm:w-10 sm:h-10 bg-opacity-70 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor }}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  style={{ color: textColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* ✅ White Container */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-[32px] shadow-lg overflow-hidden"
              style={{ backgroundColor, height: '70%', marginTop: '-20px' }}
            >
              <div className="p-4 sm:p-6 pb-24 h-full overflow-y-auto">
                {/* ✅ Title */}
                <div
                  className="text-center font-bold arabic-text text-xl sm:text-2xl mb-6 sm:mb-12"
                  style={{ color: textColor || '#52535D' }}
                >
                  {displayOffer?.title || 'عرض بدون عنوان'}
                </div>

                {/* ✅ About Offer */}
                <div className="flex justify-start items-start gap-4 sm:gap-6">
                  <img
                    src="/images/fork.png"
                    alt="Fork"
                    className="w-6 h-6 sm:w-8 sm:h-8 mt-1"
                  />
                  <div>
                    <div
                      className="font-semibold arabic-text mb-2 text-sm sm:text-base"
                      style={{ color: textColor }}
                    >
                      عن العرض
                    </div>
                    <div
                      className="leading-relaxed arabic-text text-xs sm:text-sm"
                      style={{ color: textColor }}
                    >
                      {displayOffer?.description || 'لا يوجد وصف لهذا العرض'}
                    </div>

                    <div
                      className="border-t-2 mt-4 pt-4 -mr-6 sm:-mr-12"
                      style={{ borderColor: textColor }}
                    ></div>

                    {/* ✅ Featured Products */}
                    <div className="mt-6 sm:mt-8 -mr-8 sm:-mr-15">
                      <h3
                        className="text-base sm:text-lg font-semibold mb-4 arabic-text text-left"
                        style={{ color: textColor }}
                      >
                        الأطباق المختارة
                      </h3>
                      <div className="flex flex-col -space-y-6 sm:-space-y-10">
                        {displayFeaturedProducts.map(product => (
                          <div
                            key={product.id}
                            className="w-full cursor-pointer relative transition-all duration-500 ease-out"
                          >
                            <div className="w-full h-28 sm:h-36 rounded-xl overflow-hidden flex gap-4 sm:gap-8">
                              <div className="w-1/5 h-full flex items-center justify-start p-1 pl-0">
                                <div className="relative">
                                  <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden"
                                    style={{
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }}
                                  >
                                    <img
                                      src={
                                        product.images?.[0] ||
                                        '/images/default-product.png'
                                      }
                                      alt={product.name || 'منتج بدون اسم'}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="w-4/5 h-full flex flex-col justify-start pt-6 sm:pt-10">
                                <h3
                                  className="text-xs sm:text-sm font-medium mb-1 arabic-text leading-tight"
                                  style={{ color: textColor }}
                                >
                                  {product.name || 'منتج بدون اسم'}
                                </h3>
                                <p
                                  className="text-[10px] sm:text-xs line-clamp-2 mb-2 arabic-text leading-tight"
                                  style={{ color: textColor }}
                                >
                                  {product.description || 'لا يوجد وصف للمنتج'}
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

            {/* ✅ AddToCartBar */}
            <AddToCartBar
              onAddToCart={handleAddToCart}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              price={displayOffer?.price_syp || 0}
              priceCurrency="ل.س"
              buttonText="اضف"
            />
          </div>
        </div>
      </div>
    </>
  );
};
