import React from 'react';
import { useWhiteLabelColors } from '../../providers/white-label-provider';

interface AddToCartBarProps {
  onAddToCart: (e: React.MouseEvent) => void;
  quantity: number;
  onQuantityChange: (increment: boolean) => void;
  price: number;
  priceCurrency?: string;
  buttonText?: string;
}

export const AddToCartBar: React.FC<AddToCartBarProps> = ({
  onAddToCart,
  quantity,
  onQuantityChange,
  price,
  priceCurrency = 'ل.س',
  buttonText = 'اضف'
}) => {
  const { primaryColor, secondaryColor, textColor, backgroundColor } = useWhiteLabelColors();
  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-4 py-3"
      style={{
        backgroundColor: backgroundColor,
        borderTop: `1px solid ${secondaryColor}40` // 40% opacity
      }}
    >
      <div className="flex items-center gap-4">
        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          className="w-3/5 text-white rounded-full py-3 flex flex-col items-center justify-center"
          style={{ backgroundColor: primaryColor }}
          onMouseEnter={(e) => {
            if (secondaryColor) {
              e.currentTarget.style.backgroundColor = secondaryColor;
            }
          }}
          onMouseLeave={(e) => {
            if (primaryColor) {
              e.currentTarget.style.backgroundColor = primaryColor;
            }
          }}
        >
          <span className="text-sm font-semibold arabic-text">{buttonText}</span>
          <span className="text-xs arabic-text">
            {price ? (price * quantity).toLocaleString() : 0} {priceCurrency}
          </span>
        </button>

        {/* Quantity Selector */}
        <div
          className="w-2/5 rounded-full py-2 flex items-center justify-center space-x-4"
          style={{
            backgroundColor: backgroundColor,
            border: `1px solid ${secondaryColor}60` // 60% opacity
          }}
        >
          {/* ✅ زر + يمين */}
          <button
            onClick={() => onQuantityChange(true)}
            className="text-3xl font-bold"
            style={{ color: secondaryColor }}
            onMouseEnter={(e) => {
              if (textColor) {
                e.currentTarget.style.color = textColor;
              }
            }}
            onMouseLeave={(e) => {
              if (secondaryColor) {
                e.currentTarget.style.color = secondaryColor;
              }
            }}
          >
            +
          </button>

          {/* الرقم بالنص */}
          <span
            className="font-semibold text-lg"
            style={{ color: textColor }}
          >
            {quantity}
          </span>

          {/* ✅ زر - يسار */}
          <button
            onClick={() => onQuantityChange(false)}
            className="text-3xl font-bold"
            style={{ color: secondaryColor }}
            onMouseEnter={(e) => {
              if (textColor) {
                e.currentTarget.style.color = textColor;
              }
            }}
            onMouseLeave={(e) => {
              if (secondaryColor) {
                e.currentTarget.style.color = secondaryColor;
              }
            }}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};
