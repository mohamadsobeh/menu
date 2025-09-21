import React from 'react';
import { useOrders } from '../hooks';
import type { OrdersBottomSheetProps } from '../types';

export const OrdersBottomSheet: React.FC<OrdersBottomSheetProps> = ({
    isOpen,
    onClose,
    onViewOrderDetails,
}) => {
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
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="relative w-full h-[100vh] bg-white rounded-t-2xl shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-[#EBEBEB]">
                    <button onClick={onClose} className="p-2">
                        <svg
                            className="w-6 h-6 text-[#303136] rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                    <h2 className="text-[24px] font-semibold text-black arabic-text">طلباتي</h2>
                    <span className="w-6" />
                </div>

                {/* Filter text (top-right like Figma) */}
                <div className="px-5 pt-4">
                    <div className="flex">
                        <span className="ml-auto text-[18px] text-[#A1A5B3] arabic-text">
                            {getFilterText(selectedFilter)}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500 arabic-text">جاري التحميل...</div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-red-500 arabic-text">{error}</div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500 arabic-text">لا توجد طلبات</div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 mt-3">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center gap-3 border border-[#EBEBEB] rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => onViewOrderDetails?.(order.id)}
                                >
                                    {/* Left icon area */}
                                    <div className="w-8 h-8 bg-[#F2F3F5] rounded-full flex items-center justify-center">
                                        {order.status === 'in_progress' ? (
                                            <svg className="w-4 h-4 text-[#8B8E99] rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        ) : (
                                            <span className="text-[#303136] text-sm font-semibold">C</span>
                                        )}
                                    </div>

                                    {/* Middle content */}
                                    <div className="flex-1">
                                        {/* Status line (green for in progress) */}
                                        {order.status === 'in_progress' && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-2 h-2 bg-green-600 rounded-full" />
                                                <span className="text-[#2ECC71] text-sm arabic-text">{getStatusText(order.status)}</span>
                                            </div>
                                        )}

                                        <div className="text-[14px] font-semibold text-[#303136] arabic-text">
                                            {order.itemName}
                                        </div>

                                        {order.price && (
                                            <div className="text-[12px] text-[#303136] arabic-text mt-1">
                                                {order.price}
                                            </div>
                                        )}

                                        {/* Bottom meta row */}
                                        <div className="flex items-center gap-2 mt-2">
                                            {order.status !== 'in_progress' && (
                                                <span
                                                    className={`text-sm arabic-text ${order.status === 'cancelled'
                                                            ? 'text-red-600'
                                                            : 'text-black'
                                                        }`}
                                                >
                                                    {getStatusText(order.status)}
                                                </span>
                                            )}
                                            {order.timestamp && (
                                                <span className="text-xs text-gray-500 arabic-text ml-auto">
                                                    {order.timestamp}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                        {order.imageUrl ? (
                                            <img
                                                src={order.imageUrl}
                                                alt={order.itemName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
