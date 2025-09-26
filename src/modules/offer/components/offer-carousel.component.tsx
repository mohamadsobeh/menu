import React from 'react';
import type { Offer } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

interface OfferCarouselComponentProps {
  offers: Offer[];
  onOfferClick?: (offer: Offer) => void;
}

export const OfferCarouselComponent: React.FC<OfferCarouselComponentProps> = ({
  offers,
  onOfferClick,
}) => {
  const { addItem, addFlyingAnimation } = useCart();
  const { primaryColor, secondaryColor, accentColor, textColor, backgroundColor } = useWhiteLabelColors();
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

    // ✅ Fallback for image field
    const imageUrl = offer.image_url || (offer as any).imageUrl || '/images/default-offer.png';

    addFlyingAnimation(animationId, imageUrl, startX, startY, endX, endY);

    setTimeout(() => {
      addItem({
        id: offer.id.toString(),
        name: offer.title || (offer as any).name || 'Offer',
        price_in_syp: offer.price_syp,
        price_in_usd: offer.price_usd,
        image_url: imageUrl,
        type: 'offer',
        quantity: 1,
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

    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0) {
        const nextIndex = topOfferIndex + 1;
        if (nextIndex < offers.length) {
          setTopOfferIndex(nextIndex);
        }
      } else if (dragOffset < 0) {
        const prevIndex = topOfferIndex - 1;
        if (prevIndex >= 0) {
          setTopOfferIndex(prevIndex);
        }
      }
    }

    setDragOffset(0);
  };

  // Colors are now extracted from global context

  const handleNextOffer = () => {
    const nextIndex = topOfferIndex + 1;
    if (nextIndex < offers.length) {
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
        style={{
          height: `${112 + (offers.length - 1) * 20}px`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Swipe hint */}
        {showSwipeHint && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div
              className="w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse"
              style={{ backgroundColor: `${backgroundColor}20` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${backgroundColor}80` }}
              >
                <svg
                  className="w-4 h-4 text-gray-600 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {offers.map((offer, index) => {
          const isTopOffer = index === topOfferIndex;
          const adjustedIndex = index - topOfferIndex;
          const isVisible = adjustedIndex >= 0 && adjustedIndex <= 1;

          // ✅ Fallbacks
          const imageUrl = offer.image_url || (offer as any).imageUrl || '/images/default-offer.png';
          const title = offer.title || (offer as any).name || 'بدون عنوان';
          const description = offer.description || 'لا يوجد وصف متاح';
          return (
            <div
              key={offer.id}
              className={`w-full cursor-pointer absolute transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              style={{
                top: `${adjustedIndex * 20}px`,
                zIndex: offers.length - Math.abs(adjustedIndex),
              }}
              onClick={() => handleOfferClick(offer)}
            >
              {/* Offer card */}
              <div
                className={`w-full h-28 rounded-2xl overflow-hidden flex transition-all duration-500 ${isTopOffer ? 'shadow-2xl' : 'blur-[2px] opacity-70'
                  }`}
                style={{
                  backgroundColor: isTopOffer ? primaryColor : secondaryColor,
                  transition: 'background-color 0.5s ease-in-out',
                }}
              >
                {/* Recommended badge */}
                {offer.is_recommended && (
                  <div
                    className="absolute bottom-0 left-0 px-5 rounded-bl-xl"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span className="text-black text-xs font-semibold arabic-text">
                      موصى بها
                    </span>
                  </div>
                )}

                {/* Left column - image */}
                <div className="w-1/4 h-full flex items-center justify-start p-1 pl-2">
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden"
                      style={{
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Add button */}
                    <div
                      className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-colors duration-200"
                      style={{ backgroundColor: backgroundColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${secondaryColor}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = backgroundColor;
                      }}
                      onClick={(e) => handleAddToCart(e, offer)}
                    >
                      <div className="relative w-3 h-3">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black transform -translate-y-1/2"></div>
                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-black transform -translate-x-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - text */}
                <div className="w-3/4 h-full p-4 flex flex-col justify-center">
                  <h3
                    className="text-sm font-semibold mb-1 arabic-text leading-tight"
                    style={{ color: textColor }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-xs line-clamp-2 mb-2 arabic-text leading-tight"
                    style={{ color: textColor }}
                  >
                    {description}
                  </p>
                  <div className="flex gap-1">
                    {offer.price_usd && offer.price_usd > 0 && (
                      <p
                        className="text-sm arabic-text leading-tight"
                        style={{ color: textColor }}
                      >
                        ${offer.price_usd}
                      </p>
                    )}
                    {offer.price_syp && offer.price_syp > 0 && (
                      <p
                        className="text-base font-bold arabic-text leading-tight"
                        style={{ color: textColor }}
                      >
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

      {/* Navigation */}
      <div className="flex flex-col items-center mt-4 mb-8 relative z-30">
        <div className="flex items-center gap-4">
          {/* Prev */}
          <button
            onClick={handlePrevOffer}
            disabled={topOfferIndex === 0}
            className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
            style={{
              backgroundColor: topOfferIndex === 0 ? secondaryColor : primaryColor,
            }}
          >
            <svg
              className={`w-4 h-4 ${topOfferIndex === 0 ? 'text-gray-400' : 'text-white'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-1">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === topOfferIndex
                  ? 'scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                style={{
                  backgroundColor:
                    index === topOfferIndex ? primaryColor : secondaryColor,
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={handleNextOffer}
            disabled={topOfferIndex === offers.length - 1}
            className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
            style={{
              backgroundColor:
                topOfferIndex === offers.length - 1 ? secondaryColor : primaryColor,
            }}
          >
            <svg
              className={`w-4 h-4 ${topOfferIndex === offers.length - 1
                ? 'text-gray-400'
                : 'text-white'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
