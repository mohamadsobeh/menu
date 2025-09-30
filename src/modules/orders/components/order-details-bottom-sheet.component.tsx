import React from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import { useOrderDetails } from '../hooks';
import type { OrderDetailsBottomSheetProps } from '../types';
import { OrdersBottomSheet } from '../components/orders-bottom-sheet.component';

interface OrderDetailsBottomSheetWithAssessmentProps extends OrderDetailsBottomSheetProps {
    onAssessmentClick?: (orderId: string) => void;
}

export const OrderDetailsBottomSheet: React.FC<OrderDetailsBottomSheetWithAssessmentProps> = ({
    isOpen,
    onClose,
    orderId,
    onAssessmentClick,
}) => {
    console.log('OrderDetailsBottomSheet received orderId:', orderId);
    const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();
    const {
        orderDetails,
        isLoading,
        error,
    } = useOrderDetails(orderId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div 
              className="relative w-full max-w-md sm:max-w-lg h-[100vh] shadow-2xl overflow-y-auto" 
              style={{ backgroundColor }}
            >
                {/* Header */}
                <div className="flex items-center justify-center px-4 py-5 relative" style={{ borderColor: secondaryColor }}>
                <h2
  className="text-[24px] font-semibold arabic-text px-4 py-2 rounded-md inline-block"
  style={{  color: textColor }}
>
  تفاصيل الطلب
</h2>
                   
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="arabic-text" style={{ color: secondaryColor }}>
                            جاري تحميل تفاصيل الطلب...
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="arabic-text" style={{ color: accentColor }}>{error}</div>
                    </div>
                ) : orderDetails ? (
                    <>
                        {/* Order Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Subtotal Section */}
                            <div>
                                <h3 className="text-[20px] font-semibold arabic-text text-right mb-4" style={{ color: textColor }}>
                                    المجموع الفرعي
                                </h3>
                                <div className="space-y-5">
                                    {orderDetails.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center"
                                            style={{ color: secondaryColor }}
                                        >
                                            <span className="arabic-text text-[16px]">
                                                {item.name}
                                            </span>
                                            <span className="font-semibold arabic-text text-[16px]">
                                                {item.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Section */}
                            <div className="pt-8 border-t space-y-16" style={{ borderColor: secondaryColor }}>
                                <div className="flex justify-between items-center font-bold text-[18px]" style={{ color: textColor }}>
                                    <span className="arabic-text">المجموع الكلي</span>
                                    <span className="arabic-text">{orderDetails.total}</span>
                                </div>

                                {/* زر التقييم */}
                                <button
                                    onClick={() => onAssessmentClick?.(orderDetails.id)}
                                    className="w-[70%] mx-auto flex items-center justify-center py-4 rounded-full font-semibold text-[16px] arabic-text shadow-sm transition-colors mt-6"
                                    style={{ backgroundColor: primaryColor, color: textColor }}
                                >
                                    التقييم
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t space-y-4" style={{ backgroundColor, borderColor: secondaryColor }}>
                            <p className="arabic-text text-center text-[15px]" style={{ color: textColor }}>
                                احصل على الفاتورة ك
                            </p>
                            <div className="flex gap-4">
                                {/* زر واتساب */}
                                <button 
                                  className="flex-1 flex items-center justify-center py-3 rounded-full font-semibold arabic-text transition-colors" 
                                  style={{ backgroundColor: secondaryColor, color: primaryColor }}
                                >
                                    WhatsApp
                                </button>

                                {/* زر تحميل PDF */}
                                <button 
                                  className="flex-1 flex items-center justify-center py-3 rounded-full font-semibold arabic-text transition-colors" 
                                  style={{ backgroundColor: primaryColor, color: textColor }}
                                >
                                    تحميل PDF
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1">
                    <OrdersBottomSheet isOpen={isOpen} onClose={onClose} />
                  </div>
                )}
            </div>
        </div>
    );
};
