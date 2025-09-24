import React from 'react';
import type { Offer } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';

interface PaginatedOffersComponentProps {
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
    whiteLabelConfig?: any;
}

export const PaginatedOffersComponent: React.FC<PaginatedOffersComponentProps> = ({
    offers,
    pagination,
    isLoading = false,
    onOfferClick,
    onPageChange,
    whiteLabelConfig,
}) => {
    const { addItem, addFlyingAnimation } = useCart();

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

    const handlePageChange = (page: number) => {
        if (onPageChange && page >= 1 && page <= pagination.totalPages) {
            onPageChange(page);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full mb-8">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#50BF63]"></div>
                </div>
            </div>
        );
    }

    if (offers.length === 0) {
        return (
            <div className="w-full mb-8">
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-2 arabic-text">
                        لا توجد عروض متاحة حالياً
                    </div>
                    <div className="text-gray-400 text-sm arabic-text">
                        تحقق مرة أخرى لاحقاً للعروض الجديدة
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mb-8">
            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        onClick={() => handleOfferClick(offer)}
                    >
                        {/* Offer Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={offer.image_url}
                                alt={offer.title}
                                className="w-full h-full object-cover"
                            />
                            {offer.is_recommended && (
                                <div className="absolute top-3 right-3">
                                    <span
                                        className="inline-block px-2 py-1 rounded text-xs font-bold text-black arabic-text"
                                        style={{ backgroundColor: whiteLabelConfig?.accentColor || '#FFC120' }}
                                    >
                                        مُوصى به
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Offer Content */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 arabic-text line-clamp-2">
                                {offer.title}
                            </h3>

                            {offer.description && (
                                <p className="text-sm text-gray-600 mb-3 arabic-text line-clamp-2">
                                    {offer.description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-2">
                                    {offer.price_syp && offer.price_syp > 0 && (
                                        <span
                                            className="text-lg font-bold arabic-text"
                                            style={{ color: whiteLabelConfig?.primaryColor || '#50BF63' }}
                                        >
                                            {formatSYPPrice(offer.price_syp)}
                                        </span>
                                    )}
                                    {offer.price_usd && offer.price_usd > 0 && (
                                        <span className="text-sm text-gray-500">
                                            ${offer.price_usd}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={(e) => handleAddToCart(e, offer)}
                                className="w-full py-2 px-4 rounded-lg text-white font-medium arabic-text transition-colors duration-200"
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
                                أضف إلى السلة
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
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
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${pageNum === pagination.page
                                        ? 'text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    style={{
                                        backgroundColor: pageNum === pagination.page
                                            ? (whiteLabelConfig?.primaryColor || '#50BF63')
                                            : 'transparent'
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
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                    >
                        التالي
                    </button>
                </div>
            )}

            {/* Pagination Info */}
            <div className="text-center mt-4 text-sm text-gray-500 arabic-text">
                صفحة {pagination.page} من {pagination.totalPages} • {pagination.total} عرض إجمالي
            </div>
        </div>
    );
};
