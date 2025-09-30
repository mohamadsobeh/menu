import React from 'react';
import type { ThankYouAssessmentBottomSheetProps } from '../types';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

export const ThankYouAssessmentBottomSheet: React.FC<ThankYouAssessmentBottomSheetProps> = ({
  isOpen,
  onClose,
  onShowOrders,
}) => {
  if (!isOpen) return null;
  const { backgroundColor, textColor } = useWhiteLabelColors();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full h-[100vh] rounded-t-2xl shadow-2xl flex flex-col"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Close Button */}
        <div className="flex justify-start p-4">
          <button onClick={onClose} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke={textColor}
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

        {/* Input Fields */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-6">
          {/* Email Input */}
          <div className="w-full">
            <input
              type="email"
              placeholder="البريد الألكتروني"
              className="w-full h-12 px-4 rounded-lg text-right arabic-text text-sm"
              style={{
                backgroundColor: '#F5F6F7',
                color: textColor,
                border: 'none',
                outline: 'none'
              }}
            />
          </div>

          {/* Full Name Input */}
          <div className="w-full">
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full h-12 px-4 rounded-lg text-right arabic-text text-sm"
              style={{
                backgroundColor: '#F5F6F7',
                color: textColor,
                border: 'none',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-4">
          {/* Confirm Button */}
          <button
            onClick={() => {
              onClose?.();
              onShowOrders?.();
            }}
            className="w-full h-12 rounded-lg font-semibold text-sm arabic-text transition-colors"
            style={{ backgroundColor: '#27C46B', color: '#FFFFFF' }}
          >
            تأكيد
          </button>

          {/* Back Button */}
          <button
            onClick={onClose}
            className="w-full h-12 rounded-lg font-semibold text-sm arabic-text transition-colors"
            style={{ backgroundColor: '#E0E2E7', color: textColor }}
          >
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
};
