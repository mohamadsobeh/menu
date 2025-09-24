import React, { useState } from 'react';
import type { Category, Product } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';

interface CategoriesListComponentProps {
  categories: Category[];
  onProductClick?: (product: Product, categoryImageUrl: string) => void;
  onCategoryClick?: (category: Category) => void;
}

export const CategoriesListComponent: React.FC<CategoriesListComponentProps> = ({
  categories,
  onProductClick,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const { addItem, addFlyingAnimation } = useCart();
  const [animatedProducts, setAnimatedProducts] = useState<Set<string>>(new Set());

  // Animate products when they appear
  React.useEffect(() => {
    const allProductIds = new Set<string>();
    categories.forEach(category => {
      category.products.forEach(product => {
        allProductIds.add(product.id);
      });
    });

    setAnimatedProducts(new Set());

    const newProducts = Array.from(allProductIds);
    
    if (newProducts.length > 0) {
      newProducts.forEach((productId, index) => {
        setTimeout(() => {
          setAnimatedProducts(prev => new Set([...prev, productId]));
        }, index * 100);
      });
    }
  }, [categories]);

  const handleProductClick = (product: Product, categoryImageUrl: string) => {
    if (onProductClick) {
      onProductClick(product, categoryImageUrl);
    }
  };





  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product, categoryImageUrl: string) => {
    e.stopPropagation();
    
    if (!product.is_available) {
      return;
    }

    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const cartPosition = (window as any).cartButtonPosition;
    const endX = cartPosition?.x || startX;
    const endY = cartPosition?.y || startY;

    const animationId = `${product.id}-${Date.now()}`;

    addFlyingAnimation(animationId, categoryImageUrl, startX, startY, endX, endY);
    
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price_in_syp: product.price_in_syp,
        price_in_usd: product.price_in_usd,
        image_url: categoryImageUrl,
        type: 'product',
        quantity: 1
      });
    }, 100);
  };

  return (
    <div className="w-full space-y-8">
             {categories.map((category) => {
         const isCollapsed = collapsedCategories.has(category.id);
         
                   return (
            <div key={category.id} className="mb-8" data-category-id={category.id}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold arabic-text pr-4" style={{ color: '#52535D' }}>
                {category.name}
              </h2>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200" style={{ backgroundColor: 'rgba(80, 191, 99, 0.9)' }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <path
                    d="M2 4L6 8L10 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? 'max-h-0 opacity-0' : 'max-h-none opacity-100'
              }`}
            >
              <div className="flex flex-col gap-6">
                {category.products
                  .map((product, productIndex) => {
                    const isAnimated = animatedProducts.has(product.id);
                    return (
                    <div
                      key={product.id}
                      className={`w-full cursor-pointer relative transition-all duration-500 ease-out transform ${
                        isAnimated 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                      } ${!product.is_available ? 'grayscale opacity-60' : ''}`}
                      style={{
                        transitionDelay: `${productIndex * 50}ms`
                      }}
                                             onClick={() => handleProductClick(product, category.image_url)}
                    >
                      <div className="w-full h-36 rounded-xl overflow-hidden flex gap-6 bg-white relative">
                        <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-200"></div>

                        <div className="w-1/5 h-full flex items-center justify-start p-1 pl-2">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                              <img
                                src={category.image_url}
                                alt={product.name}
                                className={`w-full h-full object-cover ${!product.is_available ? 'grayscale opacity-60' : ''
                                  }`}
                              />
                            </div>
                            <div 
                              className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 ${
                                product.is_available 
                                  ? 'bg-white cursor-pointer hover:bg-gray-100' 
                                  : 'bg-gray-300 cursor-not-allowed'
                              }`}
                              onClick={(e) => handleAddToCart(e, product, category.image_url)}
                            >
                              <div className="relative w-3 h-3">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black transform -translate-y-1/2"></div>
                                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-black transform -translate-x-1/2"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-4/5 h-full p-4 flex flex-col justify-start pt-6">
                          {product.name && (
                            <h3 className="text-sm font-medium text-black mb-1 arabic-text leading-tight">
                              {product.name}
                            </h3>
                          )}
                          {product.description && (
                            <p className={`text-xs line-clamp-2 mb-2 arabic-text leading-tight ${!product.is_available ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                              {product.description}
                            </p>
                          )}
                          <div className="flex gap-1">
                            {product.price_in_usd && product.price_in_usd > 0 && (
                              <p className={`text-sm arabic-text leading-tight mt-1 ${!product.is_available ? 'text-gray-300' : 'text-gray-400'
                                }`}>
                                ${product.price_in_usd}
                              </p>
                            )}
                            {product.price_in_syp && product.price_in_syp > 0 && (
                              <p className={`text-lg font-bold arabic-text leading-tight ${!product.is_available ? 'text-gray-400' : ''
                                }`} style={{ color: !product.is_available ? '#9CA3AF' : '#50BF63' }}>
                                {formatSYPPrice(product.price_in_syp)}
                              </p>
                            )}
                          </div>
                          {product.isfav && (
                            <div className="mt-1">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-black arabic-text ${!product.is_available ? 'bg-gray-300' : 'bg-[#FFC120]'
                                }`}>
                                مفضلة
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
