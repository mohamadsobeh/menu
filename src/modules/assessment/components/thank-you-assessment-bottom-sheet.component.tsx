import React from 'react';
import type { ThankYouAssessmentBottomSheetProps } from '../types';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

export const ThankYouAssessmentBottomSheet: React.FC<ThankYouAssessmentBottomSheetProps> = ({
    isOpen,
    onClose,
    onShowOrders,
}) => {
    if (!isOpen) return null;
    const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            <div className="relative w-full h-[100vh] rounded-t-2xl shadow-2xl flex flex-col" style={{ backgroundColor: backgroundColor }}>
                <div className="flex justify-between items-center px-4 py-2">
                    <span className="text-sm font-medium" style={{ color: textColor }}>9:41</span>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: textColor }}></div>
                        <svg className="w-4 h-4" fill="none" stroke={textColor} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364A9 9 0 015 12C5 7.029 9.029 3 14 3c.833 0 1.64.11 2.415.312M15 11a3 3 0 11-6 0 3 3 0 016 0zm-7 4h4m-4 0a7 7 0 007 7h-4a7 7 0 01-7-7z" />
                        </svg>
                        <svg className="w-4 h-4" fill="none" stroke={textColor} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
                    <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                            <div className="relative">
                                <div className="w-16 h-20 rounded-lg flex flex-col items-center justify-center relative" style={{ backgroundColor: primaryColor }}>
                                    <div className="space-y-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: textColor }}></div>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: textColor }}></div>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: textColor }}></div>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: textColor }}></div>
                                    </div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full" style={{ backgroundColor: textColor }}></div>
                                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-6 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h2 className="text-[28px] font-bold arabic-text" style={{ color: textColor }}>
                            شكراً لتقيمك
                        </h2>
                        <p className="text-[16px] arabic-text leading-relaxed max-w-sm" style={{ color: secondaryColor }}>
                            تقييمات الزبائن هية الجحر الأساس لنجاحنا يمكن لتقييم واحد أن يغير كل شيء
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            onClose?.();      // سكر شاشة الشكر
                            onShowOrders?.(); // سكر التقييم وافتح الطلبات
                        }}
                        className="w-full max-w-sm py-4 rounded-lg font-semibold text-[16px] arabic-text transition-colors"
                        style={{ backgroundColor: primaryColor, color: textColor }}
                    >
                        موافق
                    </button>
                </div>
            </div>
        </div>
    );
};
