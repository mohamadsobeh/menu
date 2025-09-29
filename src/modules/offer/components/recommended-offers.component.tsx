import React from 'react';
import type { Offer } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

interface RecommendedOffersComponentProps {
  offers: Offer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading?: boolean;
  onOfferClick?: (offer: Offer) => void;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export const RecommendedOffersComponent: React.FC<RecommendedOffersComponentProps> = ({
  offers,
  pagination,
  isLoading = false,
  onOfferClick,
  onPageChange,
  showPagination = false,
}) => {
  const { addItem, addFlyingAnimation } = useCart();
  const { primaryColor, accentColor, textColor, backgroundColor } = useWhiteLabelColors();

  // Colors are now extracted from global context

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
    addFlyingAnimation(animationId, offer.image_url || '/images/default-offer.png', startX, startY, endX, endY);

    setTimeout(() => {
      addItem({
        id: offer.id.toString(),
        name: offer.title || 'عرض بدون عنوان',
        price_in_syp: offer.price_syp,
        price_in_usd: offer.price_usd,
        image_url: offer.image_url || '/images/default-offer.png',
        type: 'offer',
        quantity: 1,
      });
    }, 100);
  };

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= pagination.totalPages) {
      onPageChange(page);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="w-full mb-8">
        <div className="text-center py-12">
          <div className="text-lg mb-2 arabic-text" style={{ color: textColor }}>
            لا توجد عروض مُوصى بها حالياً
          </div>
          <div className="text-sm arabic-text" style={{ color: textColor }}>
            تحقق مرة أخرى لاحقاً للعروض الجديدة
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      {/* Recommended Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            style={{ backgroundColor: backgroundColor }}
            onClick={() => handleOfferClick(offer)}
          >
            {/* Offer Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={offer.image_url || '/images/default-offer.png'}
                alt={offer.title || 'عرض بدون عنوان'}
                className="w-full h-full object-cover"
              />
              {/* Recommended Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className="inline-block px-2 py-1 rounded text-xs font-bold arabic-text"
                  style={{ backgroundColor: accentColor, color: textColor }}
                >
                  مُوصى به
                </span>
              </div>
            </div>

            {/* Offer Content */}
            <div className="p-4">
              <h3
                className="text-lg font-semibold mb-2 arabic-text line-clamp-2"
                style={{ color: textColor }}
              >
                {offer.title || 'عرض بدون عنوان'}
              </h3>

              <p
                className="text-sm mb-3 arabic-text line-clamp-2"
                style={{ color: textColor }}
              >
                {offer.description || 'لا يوجد وصف لهذا العرض'}
              </p>

              {/* Price */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  {offer.price_syp && offer.price_syp > 0 && (
                    <span
                      className="text-lg font-bold arabic-text"
                      style={{ color: primaryColor }}
                    >
                      {formatSYPPrice(offer.price_syp)}
                    </span>
                  )}
                  {offer.price_usd && offer.price_usd > 0 && (
                    <span className="text-sm" style={{ color: textColor }}>
                      ${offer.price_usd}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, offer)}
                className="w-full py-2 px-4 rounded-lg font-medium arabic-text transition-colors duration-200"
                style={{
                  backgroundColor: primaryColor,
                  color: textColor,
                }}
                onMouseEnter={(e) => {
                  if (accentColor) {
                    e.currentTarget.style.backgroundColor = accentColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (primaryColor) {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }
                }}
              >
                أضف إلى السلة
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - Only show if enabled */}
      {showPagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            style={{
              borderColor: textColor,
              color: textColor,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (accentColor) {
                e.currentTarget.style.backgroundColor = `${accentColor}20`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            السابق
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const startPage = Math.max(1, pagination.page - 2);
              const pageNum = startPage + i;

              if (pageNum > pagination.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  style={{
                    backgroundColor: pageNum === pagination.page ? primaryColor : 'transparent',
                    color: pageNum === pagination.page ? 'white' : textColor,
                  }}
                  onMouseEnter={(e) => {
                    if (pageNum !== pagination.page && accentColor) {
                      e.currentTarget.style.backgroundColor = `${accentColor}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pageNum !== pagination.page) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            style={{
              borderColor: textColor,
              color: textColor,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (accentColor) {
                e.currentTarget.style.backgroundColor = `${accentColor}20`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            التالي
          </button>
        </div>
      )}

      {/* Pagination Info - Only show if pagination is enabled */}
      {showPagination && (
        <div className="text-center mt-4 text-sm arabic-text" style={{ color: textColor }}>
          صفحة {pagination.page} من {pagination.totalPages} • {pagination.total} عرض مُوصى به إجمالي
        </div>
      )}
    </div>
  );
};
