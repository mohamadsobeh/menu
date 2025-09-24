import React, { useEffect, useRef, useState } from 'react';
import type { Product } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { AddToCartBar } from '../../../shared/components';

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
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [selectedAdditions, setSelectedAdditions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setDragOffset(0);
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
    if (!product) return;

    e.stopPropagation();

    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const cartPosition = (window as any).cartButtonPosition;
    const endX = cartPosition?.x || startX;
    const endY = cartPosition?.y || startY;

    const animationId = `${product.id}-${Date.now()}`;

    addFlyingAnimation(animationId, product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || "/images/default-product.png", startX, startY, endX, endY);

    // Get selected additions
    const selectedAdditionsList = product.additions?.filter(addition => selectedAdditions.has(addition.id)) || [];

    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price_in_syp: product.price_in_syp,
        price_in_usd: product.price_in_usd,
        image_url: product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || "/images/default-product.png",
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


      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 top-0 z-50 transition-all duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ transform, willChange }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
                 {/* Inner container */}
         <div
           className="w-full h-full bg-white shadow-2xl"
           style={{ borderRadius }}
         >
          {/* Content */}
          <div className="relative h-full">
                         {/* Close button - top right corner */}
             <button
               onClick={handleClose}
               className="absolute top-8 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
             >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main content area */}
            <div className="h-full overflow-y-auto">
              {/* Product Image - large and prominent */}
              <div className="relative w-full h-72 bg-white rounded-t-3xl mt-4">
                <img
                  src={categoryImageUrl || product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || "/images/default-product.png"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
              </div>

              {/* Product Details Section */}
              <div className="px-6 py-4">
                {/* Product Name - centered and large */}
                <div className="text-center text-gray-800 font-medium arabic-text text-xl mb-4">
                  {product.name}
                </div>

                {/* Price and Calories Row */}
                <div className="flex justify-between items-center mb-4">
                  {/* Price - left aligned */}
                  <div className="text-lg font-bold text-gray-800 arabic-text">
                    {product.price_in_syp ? `${product.price_in_syp.toLocaleString()} ل.س` : 'غير محدد'}
                  </div>

                  {/* Calories with flame icon */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-500 arabic-text">سعرة {product.calories || 0}</span>
                    <div className="w-4 h-4 text-red-500">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 6 12 6 12s6-8.5 6-12c0-3.5-2.5-6-6-6z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="mb-4 mt-6">
                  <h3 className="text-gray-800 font-medium arabic-text text-base">الوصف</h3>
                </div>
                <div className="text-gray-600 leading-relaxed arabic-text text-sm text-justify">
                  {product.description || 'لا يوجد وصف متاح لهذا المنتج'}
                </div>
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Ingredients Dropdown */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                    className="w-full flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-800 font-medium arabic-text">المكونات</span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${isIngredientsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isIngredientsOpen && (
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      {product.ingredients && product.ingredients.length > 0 ? (
                        <ul className="space-y-2">
                          {product.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-gray-600 arabic-text text-sm flex items-center gap-2">
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 arabic-text text-sm">لا توجد مكونات متاحة</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Additions */}
                {product.additions && product.additions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-gray-800 font-medium arabic-text text-base mb-4">اختر الاضافات</h3>
                    <div className="space-y-3">
                      {product.additions.map((addition) => (
                        <div key={addition.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedAdditions(prev => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(addition.id)) {
                                    newSet.delete(addition.id);
                                  } else {
                                    newSet.add(addition.id);
                                  }
                                  return newSet;
                                });
                              }}
                              disabled={!addition.is_available}
                              className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                                selectedAdditions.has(addition.id)
                                  ? 'bg-emerald-600 border-emerald-600'
                                  : addition.is_available
                                  ? 'border-gray-300'
                                  : 'border-gray-200 bg-gray-100'
                              }`}
                            >
                              {selectedAdditions.has(addition.id) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <span className={`arabic-text text-sm ${
                              addition.is_available ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              {addition.name}
                            </span>
                          </div>
                          <span className={`arabic-text text-sm ${
                            addition.is_available ? 'text-gray-500' : 'text-gray-300'
                          }`}>
                            + {addition.price_in_syp.toLocaleString()} ل.س
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>
              </div>
            </div>

            {/* Add to Cart Bar */}
            <AddToCartBar
              onAddToCart={handleAddToCart}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              price={(() => {
                const selectedAdditionsList = product.additions?.filter(addition => selectedAdditions.has(addition.id)) || [];
                const additionsPrice = selectedAdditionsList.reduce((total, addition) => total + addition.price_in_syp, 0);
                return (product.price_in_syp || 0) + additionsPrice;
              })()}
              priceCurrency="ل.س"
              buttonText="اضف"
            />
          </div>
        </div>
      </div>
    </>
  );
};
