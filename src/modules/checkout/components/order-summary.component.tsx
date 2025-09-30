import React from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import { formatSYPPrice } from '../../../shared/utils';
import type { OrderSummary } from '../types';

interface OrderSummaryComponentProps {
  orderSummary: OrderSummary;
}

export const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({ orderSummary }) => {
  const { backgroundColor, textColor, secondaryColor, primaryColor } = useWhiteLabelColors();
  return (
    <div className="p-4 space-y-2" style={{ backgroundColor: backgroundColor }}>
      {/* Individual Items Breakdown */}
      {orderSummary.items.map((item, index) => (
        <div
          key={`breakdown-${item.id}-${index}`}
          className="flex justify-between text-sm arabic-text"
          style={{ color: textColor }}
        >
          <span>{item.name}</span>
          <span>{formatSYPPrice(item.price_in_syp * item.quantity)}</span>
        </div>
      ))}

      {/* Subtotal */}
      <div className="flex justify-between items-center border-t pt-2" style={{ borderColor: secondaryColor }}>
        <span className="text-base font-semibold arabic-text" style={{ color: textColor }}>
          المجموع الفرعي
        </span>
        <span className="text-base arabic-text" style={{ color: textColor }}>
          {formatSYPPrice(orderSummary.subtotal)}
        </span>
      </div>

      {/* Discount */}
      {orderSummary.discount > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium arabic-text" style={{ color: primaryColor }}>
            الخصم
          </span>
          <span className="text-sm font-medium" style={{ color: primaryColor }}>
            -{formatSYPPrice(orderSummary.discount)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold arabic-text" style={{ color: textColor }}>المجموع الكلي</span>
        <span className="text-lg font-bold arabic-text" style={{ color: primaryColor }}>
          {formatSYPPrice(orderSummary.total)}
        </span>
      </div>
    </div>
  );
};
