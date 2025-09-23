import React from 'react';
import type { Offer } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';

interface OfferComponentProps {
  offers: Offer[];
  onOfferClick?: (offer: Offer) => void;
}

export const OfferComponent: React.FC<OfferComponentProps> = ({
  offers,
  onOfferClick
}) => {
  const { addItem, addFlyingAnimation } = useCart();
  const [topOfferIndex, setTopOfferIndex] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartY, setDragStartY] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [showSwipeHint, setShowSwipeHint] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleOfferClick = (offer: Offer) => {
    if (onOfferClick) {
      onOfferClick(offer);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, offer: Offer) => {
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
        quantity: 1
      });
    }, 100);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartY(clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - dragStartY;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Determine if we should switch offers based on drag distance
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0) {
        // Swipe right - go to next offer
        const nextIndex = topOfferIndex + 1;
        if (nextIndex < offers.filter(offer => offer.is_recommended).length) {
          setTopOfferIndex(nextIndex);
        }
      } else if (dragOffset < 0) {
        // Swipe left - go to previous offer
        const prevIndex = topOfferIndex - 1;
        if (prevIndex >= 0) {
          setTopOfferIndex(prevIndex);
        }
      }
    }

    setDragOffset(0);
  };

  // CSS variable for the primary color - can be changed dynamically
  const primaryColor = '#50BF63';

  const handleNextOffer = () => {
    const nextIndex = topOfferIndex + 1;
    if (nextIndex < offers.filter(offer => offer.is_recommended).length) {
      setTopOfferIndex(nextIndex);
    }
  };

  const handlePrevOffer = () => {
    const prevIndex = topOfferIndex - 1;
    if (prevIndex >= 0) {
      setTopOfferIndex(prevIndex);
    }
  };

  const handleDotClick = (index: number) => {
    setTopOfferIndex(index);
  };

  return (
    <div className="w-full">
      {/* Offers container with fixed height */}
      <div
        className="relative"
        style={{ height: `${112 + (offers.filter(offer => offer.is_recommended).length - 1) * 20}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Swipe hint animation */}
        {showSwipeHint && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-gray-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        )}
        {offers
          .filter(offer => offer.is_recommended)
          .map((offer, index) => {
            const isTopOffer = index === topOfferIndex;
            const adjustedIndex = index - topOfferIndex;

            // Only show the top offer and one underneath
            const isVisible = adjustedIndex >= 0 && adjustedIndex <= 1;

            return (
              <div
                key={offer.id}
                className={`w-full cursor-pointer absolute transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                style={{
                  top: `${adjustedIndex * 20}px`,
                  zIndex: offers.filter(offer => offer.is_recommended).length - Math.abs(adjustedIndex)
                }}
                onClick={() => handleOfferClick(offer)}
              >
                {/* Offer card with two columns */}
                <div
                  className={`w-full h-28 rounded-2xl overflow-hidden flex transition-all duration-500 ${isTopOffer
                      ? 'shadow-2xl'
                      : 'blur-[2px] opacity-70'
                    }`}
                  style={{
                    backgroundColor: isTopOffer ? primaryColor : '#9CA3AF',
                    transition: 'background-color 0.5s ease-in-out'
                  }}
                >
                  {/* Recommended badge */}
                  {offer.is_recommended && (
                    <div className="absolute bottom-0 left-0 bg-[#FFC120] px-5 rounded-bl-xl" style={{ paddingTop: '1px', paddingBottom: '1px' }}>
                      <span className="text-black text-xs font-semibold arabic-text">موصى بها</span>
                    </div>
                  )}

                  {/* Left column - Image */}
                  <div className="w-1/4 h-full flex items-center justify-start p-1 pl-2">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                        <img
                          src={offer.image_url}
                          alt={offer.title || 'Offer'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* White circle with + button */}
                      <div
                        className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={(e) => handleAddToCart(e, offer)}
                      >
                        <div className="relative w-3 h-3">
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black transform -translate-y-1/2"></div>
                          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-black transform -translate-x-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Text content */}
                  <div className="w-3/4 h-full p-4 flex flex-col justify-center">
                    {offer.title && (
                      <h3 className="text-sm font-semibold text-black mb-1 arabic-text leading-tight">
                        {offer.title}
                      </h3>
                    )}
                    {offer.description && (
                      <p className="text-xs text-white line-clamp-2 mb-2 arabic-text leading-tight">
                        {offer.description}
                      </p>
                    )}
                    <div className="flex gap-1">
                      {offer.price_usd && offer.price_usd > 0 && (
                        <p className="text-sm text-white arabic-text leading-tight">
                          ${offer.price_usd}
                        </p>
                      )}
                      {offer.price_syp && offer.price_syp > 0 && (
                        <p className="text-base font-bold text-white arabic-text leading-tight">
                          {formatSYPPrice(offer.price_syp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Navigation arrows and dots - positioned outside offers container */}
      <div className="flex flex-col items-center mt-4 mb-8 relative z-30">
        <div className="flex items-center gap-4">
          {/* Previous arrow */}
          <button
            onClick={handlePrevOffer}
            disabled={topOfferIndex === 0}
            className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 ${topOfferIndex === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'cursor-pointer'
              }`}
            style={{
              backgroundColor: topOfferIndex === 0
                ? '#D1D5DB'
                : `${primaryColor}`
            }}
          >
            <svg className={`w-4 h-4 ${topOfferIndex === 0 ? 'text-gray-400' : 'text-white'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex gap-1">
            {offers
              .filter(offer => offer.is_recommended)
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${index === topOfferIndex
                      ? 'bg-[#50BF63] scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={handleNextOffer}
            disabled={topOfferIndex === offers.filter(offer => offer.is_recommended).length - 1}
            className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 ${topOfferIndex === offers.filter(offer => offer.is_recommended).length - 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'cursor-pointer'
              }`}
            style={{
              backgroundColor: topOfferIndex === offers.filter(offer => offer.is_recommended).length - 1
                ? '#D1D5DB'
                : `${primaryColor}`
            }}
          >
            <svg className={`w-4 h-4 ${topOfferIndex === offers.filter(offer => offer.is_recommended).length - 1 ? 'text-gray-400' : 'text-white'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
