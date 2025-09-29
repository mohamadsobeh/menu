import React, { useEffect, useRef, useState } from 'react';
import type { Product } from '../../../shared/types';
import { useCart } from '../../../shared/contexts';
import { formatSYPPrice } from '../../../shared/utils';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

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
  const { primaryColor, secondaryColor, accentColor, textColor, backgroundColor } = useWhiteLabelColors();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAdditions, setSelectedAdditions] = useState<Set<string>>(new Set());
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setDragOffset(0);
      setIsVisible(true);

      window.history.pushState({ sheetOpen: true }, '');
      const handlePopState = (event: PopStateEvent) => {
        if (event.state?.sheetOpen || !event.state) handleClose();
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
    if ((e.target as HTMLElement).closest('.scrollable-content')?.scrollTop! > 0) return;
    setIsDragging(true);
    setDragStartY(clientY);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const offset = clientY - dragStartY;
    if (offset > 0) setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 100) handleClose();
    else setDragOffset(0);
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
    addFlyingAnimation(
      animationId,
      categoryImageUrl || product.images?.[0] || "/images/default-product.png",
      startX,
      startY,
      endX,
      endY
    );

    const selectedAdditionsList =
      product.additions?.filter(addition =>
        selectedAdditions.has(addition.id.toString())
      ) || [];

    setTimeout(() => {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price_in_syp: parseFloat(product.priceSyp),
        price_in_usd: product.priceUsd ? parseFloat(product.priceUsd) : 0,
        image_url:
          categoryImageUrl ||
          product.images?.[0] ||
          "/images/default-product.png",
        type: "product",
        quantity: quantity,
        selectedAdditions: selectedAdditionsList
      });

      setToastMessage("✅ تمت الإضافة إلى السلة");
      setTimeout(() => setToastMessage(null), 2000);
    }, 100);
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prev => (increment ? prev + 1 : Math.max(1, prev - 1)));
  };

  if (!product) return null;

  const transform = isClosing
    ? "translateY(100%)"
    : `translateY(${Math.min(dragOffset, 100)}px)`;

  const borderRadius = isClosing ? "0" : "24px 24px 0 0";
  const willChange = isDragging ? "transform" : "auto";

  return (
    <>
      {isVisible && !isClosing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 z-40"
          onClick={handleClose}
        />
      )}

      {toastMessage && (
        <div
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-lg z-[100] arabic-text text-sm"
          style={{ backgroundColor: primaryColor }}
        >
          {toastMessage}
        </div>
      )}

      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 top-0 z-50 transition-all duration-300 ease-out ${isVisible ? "translate-y-0" : "translate-y-full"
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
        <div
          className="w-full h-full shadow-2xl rounded-t-3xl flex flex-col"
          style={{ backgroundColor: backgroundColor, borderRadius }}
        >
          {/* Image */}
          <div
            className="relative w-full"
            style={{ height: "287px", backgroundColor: backgroundColor }}
          >
            <img
              src={
                categoryImageUrl ||
                product.images?.[0] ||
                "/images/default-product.png"
              }
              alt={product.name}
              className="w-full h-full object-cover rounded-t-[18px]"
            />
            <button
              onClick={handleClose}
              className="absolute top-[20px] right-[20px] w-9 h-9 rounded-full flex items-center justify-center shadow-lg z-10 bg-black/50"
            >
              <svg
                className="w-5 h-5 text-white"
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

          {/* Product Details with scroll */}
          <div
            className="flex-1 overflow-y-auto scrollable-content"
            style={{
              width: "428px",
              height: "841px",
              padding: "24px 18px",
              gap: "8px",
              backgroundColor: backgroundColor,
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px"
            }}
          >
            {/* الاسم */}
            <div
  className="font-medium arabic-text mb-4"
  style={{
    color: textColor,
    fontSize: "20px",
    lineHeight: "100%",
    letterSpacing: "-0.04em",
    textAlign: "right",
    width: "391px",
    height: "24px"
  }}
>
  {product.name}
</div>


            {/* السعر + السعرات */}
           {/* ✅ القسم تبع السعر + السعرات الحرارية */}
<div className="flex justify-between items-center mb-2 w-full">
  {/* السعر */}
  <div
    className="arabic-text font-semibold"
    style={{
      fontSize: "24px",         // الحجم حسب Figma
      color: primaryColor,      // ياخد اللون من الربط
      lineHeight: "100%"
    }}
  >
    {product.priceSyp
      ? `${formatSYPPrice(parseFloat(product.priceSyp))}`
      : "غير محدد"}
  </div>

  {/* السعرات الحرارية */}
  {product.calories && (
    <div className="flex items-center gap-1">
      <span
        className="arabic-text"
        style={{
          fontSize: "14px",       // الحجم أصغر
          color: accentColor,     // ياخد اللون من الربط
          lineHeight: "100%"
        }}
      >
        {product.calories} سعرة
      </span>
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        style={{ color: accentColor }}  // ياخد اللون من الربط
      >
        <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 6 12 6 12s6-8.5 6-12c0-3.5-2.5-6-6-6z" />
      </svg>
    </div>
  )}
</div>


           {/* الوصف */}
           <div className="mt-8">
  <h3
    className="font-medium arabic-text text-[16px] leading-[100%] mb-4"
    style={{ color: textColor, textAlign: "right" }}
  >
    الوصف
  </h3>

  <p
    className="arabic-text text-[14px] leading-[170%] font-normal mb-4"
    style={{ color: secondaryColor, textAlign: "right" }}
  >
    {product.description || "لا يوجد وصف متاح لهذا المنتج"}
  </p>

  {/* ✅ الخط الفاصل */}
  <div
    className="w-full mb-4"
    style={{
      borderBottom: `1px solid ${secondaryColor}40` // اللون حسب الربط مع شفافية
    }}
  />
</div>


            {/* المكونات */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                  className="w-full flex justify-between items-center p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: backgroundColor }}
                >
                  <span
                    className="font-medium arabic-text"
                    style={{ color: textColor }}
                  >
                    المكونات :
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isIngredientsOpen ? "rotate-180" : ""}`}
                    style={{ color: secondaryColor }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isIngredientsOpen && (
                  <div
                    className="mt-3 p-3 rounded-lg"
                    style={{ backgroundColor: backgroundColor }}
                  >
                    <ul className="space-y-2">
                      {product.ingredients.map((ingredient, idx) => (
                        <li
                          key={idx}
                          className="arabic-text text-sm flex items-center gap-2"
                          style={{ color: secondaryColor }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          ></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* الإضافات */}
            {product.additions && product.additions.length > 0 && (
              <div className="mt-6">
                <h3
                  className="text-lg font-semibold mb-4 arabic-text"
                  style={{ color: textColor }}
                >
                  اختر الاضافات
                </h3>
                <div className="space-y-3">
                  {product.additions.map(addition => (
                    <div
                      key={addition.id}
                      className="flex items-center justify-between py-2"
                    >
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
                          className="w-5 h-5 border-2 rounded flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor: selectedAdditions.has(addition.id.toString())
                              ? primaryColor
                              : 'transparent',
                            borderColor: selectedAdditions.has(addition.id.toString())
                              ? primaryColor
                              : textColor
                          }}
                        >
                          {selectedAdditions.has(addition.id.toString()) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                        <span
                          className="arabic-text text-sm"
                          style={{ color: textColor }}
                        >
                          {addition.name}
                        </span>
                      </div>
                      <span
                        className="arabic-text text-sm"
                        style={{ color: secondaryColor }}
                      >
                        + {formatSYPPrice(parseFloat(addition.priceSyp))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar ثابت */}
          <div
            style={{
              width: "428px",
              height: "114px",
              padding: "21px 23px",
              backgroundColor: backgroundColor,
              borderTop: `1px solid #EEEFF1`
            }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="w-3/5 text-white rounded-full py-4 flex flex-col items-center justify-center disabled:cursor-not-allowed"
                style={{
                  backgroundColor: product.isAvailable ? primaryColor : textColor,
                  borderRadius: "50px",     // نفس شكل الزر الدائري
                  height: "72px",           // ارتفاع الزر مثل Figma
                  padding: "21px 76px",     // مساحة داخلية
                  gap: "6px",               // مسافة بين النصوص
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.03)", // ظل خفيف
                }}
              >
                <span className="text-sm font-semibold arabic-text">
                  اضف {quantity > 1 && `(${quantity})`}
                </span>
                <span className="text-xs arabic-text">
                  {(() => {
                    const selectedAdditionsList =
                      product.additions?.filter(addition =>
                        selectedAdditions.has(addition.id.toString())
                      ) || [];
                    const additionsPrice = selectedAdditionsList.reduce(
                      (total, addition) =>
                        total + parseFloat(addition.priceSyp),
                      0
                    );
                    return (
                      ((parseFloat(product.priceSyp) || 0) + additionsPrice) *
                      quantity
                    ).toLocaleString();
                  })()}{" "}
                  ل.س
                </span>
              </button>

              <div
  className="w-2/5 rounded-full py-3 flex items-center justify-center gap-6"
  style={{
    backgroundColor: backgroundColor,
    border: `2px solid ${secondaryColor}60`, // حسب الصورة 2px
  }}
>
  {/* زر + */}
  <button
    onClick={() => handleQuantityChange(true)}
    className="text-3xl font-bold"
    style={{ color: secondaryColor }}
  >
    +
  </button>

  {/* العدد */}
  <span
    className="font-semibold text-lg arabic-text"
    style={{ color: textColor }}
  >
    {quantity}
  </span>

  {/* زر - */}
  <button
    onClick={() => handleQuantityChange(false)}
    className="text-3xl font-bold"
    style={{ color: secondaryColor }}
  >
    -
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
