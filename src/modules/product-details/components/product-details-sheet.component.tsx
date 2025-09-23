import React, { useEffect, useRef, useState } from 'react';
import type { Product } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';

interface ProductDetailsSheetProps {
  product: Product | null;
  categoryImageUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsSheet: React.FC<ProductDetailsSheetProps> = ({
  product,
  categoryImageUrl,
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
  const [selectedAdditions, setSelectedAdditions] = useState<Set<string>>(new Set());

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
    if (!product) return;

    e.stopPropagation();

    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const cartPosition = (window as any).cartButtonPosition;
    const endX = cartPosition?.x || startX;
    const endY = cartPosition?.y || startY;

    const animationId = `${product.id}-${Date.now()}`;

    addFlyingAnimation(animationId, categoryImageUrl || product.images?.[0] || "/images/default-product.png", startX, startY, endX, endY);

    // Get selected additions
    const selectedAdditionsList = product.additions?.filter(addition => selectedAdditions.has(addition.id.toString())) || [];

    setTimeout(() => {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price_in_syp: parseFloat(product.priceSyp),
        price_in_usd: product.priceUsd ? parseFloat(product.priceUsd) : 0,
        image_url: categoryImageUrl || product.images?.[0] || "/images/default-product.png",
        type: 'product',
        quantity: quantity,
        selectedAdditions: selectedAdditionsList
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

  if (!product) return null;

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
                src={categoryImageUrl || product.images?.[0] || "/images/default-product.png"}
                alt={product.name}
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
                <div className="text-center text-gray-600 font-bold arabic-text text-2xl mb-12">{product.name}</div>
                <div className="flex justify-start items-start gap-6">
                  <img src="/images/fork.png" alt="Fork" className="w-8 h-8 mt-1" />
                  <div>
                    <div className="text-gray-600 font-semibold arabic-text mb-2">عن المنتج</div>
                    <div className="text-gray-500 leading-relaxed arabic-text">
                      {product.description}
                    </div>
                    <div className="border-t-2 border-gray-300 mt-4 pt-4 -mr-12"></div>

                    {/* Product Details Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 arabic-text text-left">تفاصيل المنتج</h3>
                      <div className="space-y-4">
                        {/* Price Information */}
                        <div className="flex items-center gap-4">
                          {product.priceUsd && parseFloat(product.priceUsd) > 0 && (
                            <div className="text-gray-600">
                              <span className="text-sm">السعر بالدولار:</span>
                              <span className="text-lg font-bold ml-2">${product.priceUsd}</span>
                            </div>
                          )}
                          {product.priceSyp && parseFloat(product.priceSyp) > 0 && (
                            <div className="text-gray-600">
                              <span className="text-sm">السعر بالليرة:</span>
                              <span className="text-lg font-bold ml-2 text-[#50BF63]">{formatSYPPrice(parseFloat(product.priceSyp))}</span>
                            </div>
                          )}
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">الحالة:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {product.isAvailable ? 'متوفر' : 'غير متوفر'}
                          </span>
                        </div>

                        {/* Favorite Status */}
                        {product.isFav && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">الحالة:</span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFC120] text-black">
                              مفضلة
                            </span>
                          </div>
                        )}

                        {/* Calories */}
                        {product.calories && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">السعرات الحرارية:</span>
                            <span className="text-sm font-bold text-red-600">
                              {product.calories} سعرة حرارية
                            </span>
                          </div>
                        )}

                        {/* Category and Restaurant */}
                        <div className="flex items-center gap-4">
                          {product.category?.name && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">الفئة:</span>
                              <span className="text-sm font-bold text-gray-800">{product.category?.name}</span>
                            </div>
                          )}
                          {product.restaurant?.name && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">المطعم:</span>
                              <span className="text-sm font-bold text-gray-800">{product.restaurant?.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Ingredients */}
                        {product.ingredients && product.ingredients.length > 0 && (
                          <div className="mt-4">
                            <span className="text-sm text-gray-600 block mb-2">المكونات:</span>
                            <div className="flex flex-wrap gap-2">
                              {product.ingredients.map((ingredient, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Additions */}
                    {product.additions && product.additions.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 arabic-text text-left">اختر الاضافات</h3>
                        <div className="space-y-3">
                          {product.additions.map((addition) => (
                            <div key={addition.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    setSelectedAdditions(prev => {
                                      const newSet = new Set(prev);
                                      if (newSet.has(addition.id.toString())) {
                                        newSet.delete(addition.id.toString());
                                      } else {
                                        newSet.add(addition.id.toString());
                                      }
                                      return newSet;
                                    });
                                  }}
                                  disabled={!addition.isAvailable}
                                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${selectedAdditions.has(addition.id.toString())
                                    ? 'bg-emerald-600 border-emerald-600'
                                    : addition.isAvailable
                                      ? 'border-gray-300'
                                      : 'border-gray-200 bg-gray-100'
                                    }`}
                                >
                                  {selectedAdditions.has(addition.id.toString()) && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                                <span className={`arabic-text text-sm ${addition.isAvailable ? 'text-gray-800' : 'text-gray-400'
                                  }`}>
                                  {addition.name}
                                </span>
                              </div>
                              <span className={`arabic-text text-sm ${addition.isAvailable ? 'text-gray-500' : 'text-gray-300'
                                }`}>
                                + {formatSYPPrice(parseFloat(addition.priceSyp))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Static Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center gap-4">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className="w-3/5 bg-emerald-600 text-white rounded-full py-4 flex flex-col items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-semibold arabic-text">اضف</span>
                  <span className="text-xs arabic-text">{(() => {
                    const selectedAdditionsList = product.additions?.filter(addition => selectedAdditions.has(addition.id.toString())) || [];
                    const additionsPrice = selectedAdditionsList.reduce((total, addition) => total + parseFloat(addition.priceSyp), 0);
                    return ((parseFloat(product.priceSyp) || 0) + additionsPrice) * quantity;
                  })()}</span>
                </button>

                {/* Quantity Selector */}
                <div className="w-2/5 bg-white rounded-full py-3 border border-gray-300 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    -
                  </button>
                  <span className="text-black font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(true)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
