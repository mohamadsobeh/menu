import React from 'react';
import { useOrderDetails } from '../hooks';
import type { OrderDetailsBottomSheetProps } from '../types';

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
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="relative w-full h-[100vh] bg-white rounded-t-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-center px-4 py-5 border-b border-[#EBEBEB] relative">
                    <h2 className="text-[24px] font-semibold text-black arabic-text">
                        تفاصيل الطلب
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute left-4 p-2 text-[#303136]"
                    >
                        <svg
                            className="w-6 h-6 rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-gray-500 arabic-text">
                            جاري تحميل تفاصيل الطلب...
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-red-500 arabic-text">{error}</div>
                    </div>
                ) : orderDetails ? (
                    <>
                        {/* Order Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Subtotal Section */}
                            <div>
                                <h3 className="text-[20px] font-semibold text-black arabic-text text-right mb-4">
                                    المجموع الفرعي
                                </h3>
                                <div className="space-y-5">
                                    {orderDetails.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center text-[#626471]"
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
                            <div className="pt-8 border-t border-[#EBEBEB] space-y-16">
                                <div className="flex justify-between items-center text-black font-bold text-[18px]">
                                    <span className="arabic-text">المجموع الكلي</span>
                                    <span className="arabic-text">{orderDetails.total}</span>
                                </div>

                                {/* زر التقييم */}
                                <button
                                    onClick={() => onAssessmentClick?.(orderDetails.id)}
                                    className="w-[70%] mx-auto flex items-center justify-center bg-[#22D27B] text-white py-4 rounded-full font-semibold text-[16px] arabic-text shadow-sm hover:bg-[#1CB56A] transition-colors mt-6"
                                >
                                    التقييم
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 bg-white border-t border-[#EBEBEB] space-y-4">
                            <p className="text-[#303136] arabic-text text-center text-[15px]">
                                احصل على الفاتورة ك
                            </p>
                            <div className="flex gap-4">
                                {/* زر واتساب */}
                                <button className="flex-1 flex items-center justify-center bg-[#E9FCEB] text-[#50BF63] py-3 rounded-full font-semibold arabic-text hover:bg-[#D4F4D4] transition-colors">
                                    WhatsApp
                                </button>

                                {/* زر تحميل PDF */}
                                <button className="flex-1 flex items-center justify-center bg-[#50BF63] text-white py-3 rounded-full font-semibold arabic-text hover:bg-[#45A845] transition-colors">
                                    تحميل PDF
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-red-500 arabic-text">
                            لم يتم العثور على تفاصيل الطلب.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
