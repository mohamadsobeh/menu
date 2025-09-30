import React from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import { useOrders } from '../hooks';
import type { OrdersBottomSheetProps } from '../types';
import { ArrowLeft, ChevronLeft, RotateCcw } from 'lucide-react';

export const OrdersBottomSheet: React.FC<OrdersBottomSheetProps> = ({
  isOpen,
  onClose,
  onViewOrderDetails,
}) => {
  const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();
  const {
    filteredOrders,
    isLoading,
    error,
    selectedFilter,
    getStatusText
  } = useOrders();

  if (!isOpen) return null;

  const getFilterText = (filter: string) => {
    switch (filter) {
      case 'all':
        return 'جارية';
      case 'in_progress':
        return 'جارية';
      case 'completed':
        return 'مكتملة';
      case 'cancelled':
        return 'ملغاة';
      default:
        return filter;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-md sm:max-w-lg h-[100vh] shadow-2xl overflow-y-auto"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onClose} className="p-3">
            <ArrowLeft
              className="w-7 h-7" 
              stroke={textColor}
            />
          </button>
          <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold arabic-text" style={{ color: textColor }}>
            طلباتي
          </h2>
          <span className="w-6" />
        </div>

        {/* Filter text (top-right like Figma) */}
        <div className="px-5 pt-4">
          <div className="flex">
            <span className="ml-auto text-[14px] sm:text-[16px] md:text-[18px] arabic-text" style={{ color: secondaryColor }}>
              {getFilterText(selectedFilter)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-6">
  {isLoading ? (
    <div className="flex items-center justify-center py-8">
      <div className="arabic-text" style={{ color: secondaryColor }}>جاري التحميل...</div>
    </div>
  ) : error ? (
    <div className="flex items-center justify-center py-8">
      <div className="arabic-text" style={{ color: accentColor }}>{error}</div>
    </div>
  ) : filteredOrders.length === 0 ? (
    <div className="flex items-center justify-center py-8">
      <div className="arabic-text" style={{ color: secondaryColor }}>لا توجد طلبات</div>
    </div>
  ) : (
    <div className="flex flex-col gap-6 mt-3">
      {filteredOrders.map((order, index) => (
        index === 0 ? (
          // الكارد الأول (خاصة)
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors"
            style={{
              border: `1px solid ${secondaryColor}`,
              backgroundColor: backgroundColor,
            }}
            onClick={() => onViewOrderDetails?.(order.id)}
          >
            {/* الصورة يمين */}
            <div className="w-[57px] h-[57px] rounded-lg overflow-hidden flex-shrink-0">
              {order.imageUrl ? (
                <img
                  src={order.imageUrl}
                  alt={order.itemName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: secondaryColor }} />
              )}
            </div>

            {/* النصوص بالنص */}
           <div className="flex-1 flex flex-col text-right mr-3">
  {order.status === 'in_progress' && (
    <div className="flex items-center gap-2 mb-1 justify-start">
      <span className="text-sm arabic-text" style={{ color: primaryColor }}>
        {getStatusText(order.status)}
      </span>
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: primaryColor }}
      />
    </div>
  )}

  <div
    className="text-[14px] font-semibold arabic-text"
    style={{ color: textColor }}
  >
    {order.itemName}
  </div>
</div>


            {/* الأيقونة يسار */}
            <div className="flex items-center justify-center">
  <ChevronLeft className="w-5 h-5" stroke={textColor} />
</div>

          </div>
        ) : (
          // باقي الكروت (بدون تغيير)
          <div
  key={order.id}
  className="flex items-center gap-5 rounded-lg p-3 cursor-pointer transition-colors w-full h-[120px]"
  style={{ border: `1px solid ${secondaryColor}`, backgroundColor }}
  onClick={() => onViewOrderDetails?.(order.id)}
>
  {/* الصورة*/}
  <div className="w-[57px] h-[57px] rounded-[12px] overflow-hidden flex-shrink-0">
    {order.imageUrl ? (
      <img src={order.imageUrl} alt={order.itemName} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full" style={{ backgroundColor: secondaryColor }} />
    )}
  </div>

  {/* المحتوى وسط */}
  <div className="flex-1">
    <div className="text-[14px] font-semibold arabic-text" style={{ color: textColor }}>
      {order.itemName}
    </div>

    {order.price && (
      <div className="text-[12px] arabic-text mt-1" style={{ color: textColor }}>
        {order.price}
      </div>
    )}

    <div className="flex items-center gap-2 mt-2">
    {order.timestamp && (
        <span className="text-xs arabic-text ml-4" style={{ color: secondaryColor }}>
          {order.timestamp}
        </span>
      )}
      {order.status !== 'in_progress' && (
        <span
          className="text-sm arabic-text"
          style={{ color: order.status === 'cancelled' ? accentColor : textColor }}
        >
          {getStatusText(order.status)}
        </span>
      )}
     
    </div>
  </div>

  {/* الايقونة */}
  <div
    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
    style={{ border: `1px solid ${secondaryColor}`, backgroundColor }}
  >
    <RotateCcw className="w-4 h-4" stroke={textColor} />
  </div>

  
</div>

        )
      ))}
    </div>
  )}
</div>



      </div>
    </div>
  );
};
