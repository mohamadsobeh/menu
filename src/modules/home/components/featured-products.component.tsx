import React from 'react';
import type { Offer } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';

interface FeaturedProductsComponentProps {
  featuredProducts: Offer[];
  onProductClick?: (product: Offer) => void;
  whiteLabelConfig?: any;
}

export const FeaturedProductsComponent: React.FC<FeaturedProductsComponentProps> = ({
  featuredProducts,
  onProductClick,
  whiteLabelConfig
}) => {
  const { addItem, addFlyingAnimation } = useCart();

  const handleProductClick = (product: Offer) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Offer) => {
    e.stopPropagation();

    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const cartPosition = (window as any).cartButtonPosition;
    const endX = cartPosition?.x || startX;
    const endY = cartPosition?.y || startY;

    const animationId = `${product.id}-${Date.now()}`;

    addFlyingAnimation(animationId, product.image_url, startX, startY, endX, endY);

    setTimeout(() => {
      addItem({
        id: product.id.toString(),
        name: product.title || 'Featured Product',
        price_in_syp: product.price_syp,
        price_in_usd: product.price_usd,
        image_url: product.image_url,
        type: 'product',
        quantity: 1
      });
    }, 100);
  };

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-bold arabic-text"
          style={{ color: whiteLabelConfig?.textColor || '#333' }}
        >
          المنتجات المميزة
        </h2>
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: whiteLabelConfig?.primaryColor || '#50BF63' }}
        ></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: whiteLabelConfig?.cardBgColor || '#fff' }}
            onClick={() => handleProductClick(product)}
          >
            {/* Product Image */}
            <div className="relative h-32">
              <img
                src={product.image_url || '/images/default.png'}
                alt={product.title || 'Featured Product'}
                className="w-full h-full object-cover"
              />

              {/* Add to Cart Button */}
              <button
                className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
                style={{
                  backgroundColor: whiteLabelConfig?.secondaryColor || '#fff'
                }}
                onClick={(e) => handleAddToCart(e, product)}
              >
                <div className="relative w-4 h-4">
                  <div
                    className="absolute top-1/2 left-0 w-full h-0.5 transform -translate-y-1/2"
                    style={{ backgroundColor: whiteLabelConfig?.textColor || '#000' }}
                  ></div>
                  <div
                    className="absolute left-1/2 top-0 w-0.5 h-full transform -translate-x-1/2"
                    style={{ backgroundColor: whiteLabelConfig?.textColor || '#000' }}
                  ></div>
                </div>
              </button>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h3
                className="text-sm font-semibold mb-1 arabic-text line-clamp-1"
                style={{ color: whiteLabelConfig?.textColor || '#333' }}
              >
                {product.title}
              </h3>
              {product.description && (
                <p
                  className="text-xs mb-2 arabic-text line-clamp-2"
                  style={{ color: whiteLabelConfig?.secondaryColor || '#666' }}
                >
                  {product.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {product.price_usd && product.price_usd > 0 && (
                    <span
                      className="text-xs"
                      style={{ color: whiteLabelConfig?.secondaryColor || '#999' }}
                    >
                      ${product.price_usd}
                    </span>
                  )}
                  {product.price_syp && product.price_syp > 0 && (
                    <span
                      className="text-sm font-bold arabic-text"
                      style={{ color: whiteLabelConfig?.primaryColor || '#50BF63' }}
                    >
                      {formatSYPPrice(product.price_syp)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
