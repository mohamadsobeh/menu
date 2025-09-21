import React from 'react';

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
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          className="w-3/5 bg-emerald-600 text-white rounded-full py-3 flex flex-col items-center justify-center"
        >
          <span className="text-sm font-semibold arabic-text">{buttonText}</span>
          <span className="text-xs arabic-text">{price ? (price * quantity).toLocaleString() : 0} {priceCurrency}</span>
        </button>

        {/* Quantity Selector */}
        <div className="w-2/5 bg-white rounded-full py-2 border border-gray-300 flex items-center justify-center space-x-4">
          <button
            onClick={() => onQuantityChange(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            -
          </button>
          <span className="text-black font-semibold text-lg">{quantity}</span>
          <button
            onClick={() => onQuantityChange(true)}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
