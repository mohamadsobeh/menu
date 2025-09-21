import React from 'react';
import { formatSYPPrice } from '../../../shared/utils';
import type { OrderSummary } from '../types';

interface OrderSummaryComponentProps {
  orderSummary: OrderSummary;
}

export const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({ orderSummary }) => {
  return (
    <div className="bg-gray-50 p-4 space-y-2">
      {/* Individual Items Breakdown */}
      {orderSummary.items.map((item, index) => (
        <div
          key={`breakdown-${item.id}-${index}`}
          className="flex justify-between text-sm text-gray-700 arabic-text"
        >
          <span>{item.name}</span>
          <span>{formatSYPPrice(item.price_in_syp * item.quantity)}</span>
        </div>
      ))}

      {/* Subtotal */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-2">
        <span className="text-base font-semibold arabic-text">
          المجموع الفرعي
        </span>
        <span className="text-base arabic-text">
          {formatSYPPrice(orderSummary.subtotal)}
        </span>
      </div>

      {/* Discount */}
      {orderSummary.discount > 0 && (
        <div className="flex justify-between items-center text-green-600">
          <span className="text-sm font-medium arabic-text">
            الخصم
          </span>
          <span className="text-sm font-medium">
            -{formatSYPPrice(orderSummary.discount)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold arabic-text">المجموع الكلي</span>
        <span className="text-lg font-bold arabic-text text-[#50BF63]">
          {formatSYPPrice(orderSummary.total)}
        </span>
      </div>
    </div>
  );
};
