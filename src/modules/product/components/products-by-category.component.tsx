import React from 'react';
import type { Product } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

interface ProductsByCategoryComponentProps {
    products: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    isLoading?: boolean;
    onProductClick?: (product: Product) => void;
    onPageChange?: (page: number) => void;
    whiteLabelConfig?: any;
    categoryName?: string;
}

export const ProductsByCategoryComponent: React.FC<ProductsByCategoryComponentProps> = ({
    products,
    pagination,
    isLoading = false,
    onProductClick,
    onPageChange,
    whiteLabelConfig,
    categoryName,
}) => {
    const { primaryColor, secondaryColor } = useWhiteLabelColors();
    const { addItem, addFlyingAnimation } = useCart();

    const handleProductClick = (product: Product) => {
        if (onProductClick) {
            onProductClick(product);
        }
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();

        const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2;

        const cartPosition = (window as any).cartButtonPosition;
        const endX = cartPosition?.x || startX;
        const endY = cartPosition?.y || startY;

        const animationId = `${product.id}-${Date.now()}`;

        addFlyingAnimation(animationId, product.images[0] || '', startX, startY, endX, endY);

        setTimeout(() => {
            addItem({
                id: product.id.toString(),
                name: product.name,
                price_in_syp: parseFloat(product.priceSyp),
                price_in_usd: product.priceUsd ? parseFloat(product.priceUsd) : 0,
                image_url: product.images[0] || '',
                type: 'product',
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="w-full mb-8">
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-2 arabic-text">
                        لا توجد منتجات في هذه الفئة حالياً
                    </div>
                    <div className="text-gray-400 text-sm arabic-text">
                        {categoryName && `تحقق من فئات أخرى غير ${categoryName}`}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mb-8">
            {/* Category Header */}
            {categoryName && (
                <div className="mb-6">
                    <h2
                        className="text-2xl font-bold text-gray-800 mb-2 arabic-text"
                    >
                        {categoryName}
                    </h2>
                    <p
                        className="text-gray-600 arabic-text"
                    >
                        {pagination.total} منتج متاح في هذه الفئة
                    </p>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className={`rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 ${!product.isAvailable ? 'opacity-60 grayscale' : ''
                            }`}
                        style={{ backgroundColor: whiteLabelConfig?.backgroundColor }}
                        onClick={() => handleProductClick(product)}
                    >
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={product.images[0] || ''}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Favorite Badge */}
                            {product.isFav && (
                                <div className="absolute top-3 right-3">
                                    <span
                                        className="inline-block px-2 py-1 rounded text-xs font-bold text-black arabic-text"
                                        style={{ backgroundColor: whiteLabelConfig?.accentColor }}
                                    >
                                        مفضلة
                                    </span>
                                </div>
                            )}
                            {/* Availability Badge */}
                            {!product.isAvailable && (
                                <div className="absolute top-3 left-3">
                                    <span className="inline-block px-2 py-1 rounded text-xs font-bold text-white arabic-text" style={{ backgroundColor: whiteLabelConfig?.accentColor }}>
                                        غير متوفر
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product Content */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 arabic-text line-clamp-2" style={{ color: whiteLabelConfig?.textColor }}>
                                {product.name}
                            </h3>

                            {product.description && (
                                <p className="text-sm mb-3 arabic-text line-clamp-2" style={{ color: whiteLabelConfig?.secondaryColor }}>
                                    {product.description}
                                </p>
                            )}

                            {/* Restaurant */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs px-2 py-1 rounded arabic-text" style={{ color: whiteLabelConfig?.secondaryColor, backgroundColor: whiteLabelConfig?.backgroundColor }}>
                                    {product.restaurant.name}
                                </span>
                            </div>

                            {/* Calories */}
                            {product.calories && (
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="text-xs arabic-text" style={{ color: whiteLabelConfig?.accentColor }}>🔥</span>
                                    <span className="text-xs arabic-text" style={{ color: whiteLabelConfig?.secondaryColor }}>
                                        {product.calories} سعرة حرارية
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-2">
                                    {product.priceSyp && (
                                        <span
                                            className="text-lg font-bold arabic-text"
                                            style={{ color: whiteLabelConfig?.primaryColor }}
                                        >
                                            {formatSYPPrice(parseFloat(product.priceSyp))}
                                        </span>
                                    )}
                                    {product.priceUsd && (
                                        <span className="text-sm" style={{ color: whiteLabelConfig?.secondaryColor }}>
                                            ${product.priceUsd}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Additions Count */}
                            {product.additions && product.additions.length > 0 && (
                                <div className="text-xs mb-3 arabic-text" style={{ color: whiteLabelConfig?.secondaryColor }}>
                                    {product.additions.length} إضافة متاحة
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={!product.isAvailable}
                                className={`w-full py-2 px-4 rounded-lg font-medium arabic-text transition-colors duration-200 ${product.isAvailable
                                    ? 'text-white'
                                    : 'cursor-not-allowed'
                                    }`}
                                style={{
                                    backgroundColor: product.isAvailable
                                        ? whiteLabelConfig?.primaryColor
                                        : secondaryColor,
                                    color: product.isAvailable ? 'white' : whiteLabelConfig?.textColor
                                }}
                                onMouseEnter={(e) => {
                                    if (product.isAvailable) {
                                        e.currentTarget.style.backgroundColor = whiteLabelConfig?.accentColor;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (product.isAvailable) {
                                        e.currentTarget.style.backgroundColor = whiteLabelConfig?.primaryColor;
                                    }
                                }}
                            >
                                {product.isAvailable ? 'أضف إلى السلة' : 'غير متوفر'}
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
                                            ? whiteLabelConfig?.primaryColor
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
            <div className="text-center mt-4 text-sm arabic-text" style={{ color: whiteLabelConfig?.secondaryColor }}>
                صفحة {pagination.page} من {pagination.totalPages} • {pagination.total} منتج إجمالي
            </div>
        </div>
    );
};
