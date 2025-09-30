import React from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';

interface PaymentFooterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  onPlaceOrder?: () => void; // ✅ إضافة اختيارية
}

export const PaymentFooterBottomSheet: React.FC<PaymentFooterBottomSheetProps> = ({
  isOpen,
  onClose,
  orderId = 'B204',
  onPlaceOrder, // ✅ استدعاء اختياري
}) => {
  if (!isOpen) return null;

  const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="relative w-full rounded-t-[16px] shadow-2xl" style={{ backgroundColor: backgroundColor }}>
        {/* Grabber */}
        <div className="flex justify-center py-2">
          <div className="w-[60px] h-[5px] rounded-[38px]" style={{ backgroundColor: secondaryColor }} />
        </div>

        {/* Header */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-6 relative">
            <h3 className="text-[16px] font-bold arabic-text mx-auto" style={{ color: textColor }}>
              تفاصيل الدفع
            </h3>
            <button
              onClick={onClose}
              className="absolute right-0 w-9 h-9 rounded-full flex items-center justify-center border"
              style={{ borderColor: secondaryColor, backgroundColor: backgroundColor, color: textColor }}
            >
              <svg
                className="w-5 h-5"
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

          {/* Order number pill */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center justify-between w-[355px] h-[72px] border rounded-[16px] px-6" style={{ borderColor: primaryColor }}>
              <span className="font-bold text-[16px] arabic-text" style={{ color: accentColor }}>
                رقم الطلب
              </span>
              <span className="font-extrabold text-[32px] arabic-text" style={{ color: primaryColor }}>
                #{orderId}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Guide accordion */}
          <div className="mt-8 rounded-[12px] px-4 pt-3 pb-4" style={{ backgroundColor: secondaryColor }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-[14px] arabic-text" style={{ color: textColor }}>
                دليل الدفع
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke={textColor}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </div>

            {/* List */}
            <ul className="space-y-3 text-[12px] leading-relaxed arabic-text list-disc pr-5" style={{ color: textColor }}>
              <li>عند انتهاء الاختيار يضغط المستخدم على إتمام الطلب.</li>
              <li>تظهر فاتورة تفصيلية مع زر تأكيد الطلب.</li>
              <li>بعد التأكيد يظهر رقم الطلب بشكل واضح.</li>
              <li>سيظهر رقم الطلب بشكل واضح على الشاشة.</li>
              <li>توجه إلى الكاشير وقدّم رقم الطلب للدفع.</li>
            </ul>

            {/* Contact button */}
            <button
              onClick={onPlaceOrder} // ✅ إذا تم تمريره يستعمله
              className="w-full h-[34px] rounded-[12px] 
                font-medium text-[16px] leading-none arabic-text mt-8 
                flex items-center justify-center"
              style={{ backgroundColor: primaryColor, color: textColor }}
            >
              تواصل معنا
            </button>
          </div>

          {/* Order details */}
          <div className="mt-8 w-full px-4">
            <h4 className="text-[24px] font-semibold arabic-text flex items-center justify-center mb-5" style={{ color: textColor }}>
              تفاصيل الطلب
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[17px] font-semibold arabic-text" style={{ color: textColor }}>
                  المجموع الكلي
                </span>
                <span className="text-[15px] font-semibold arabic-text" style={{ color: textColor }}>
                  130 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[17px] font-semibold arabic-text" style={{ color: textColor }}>
                  المجموع الفرعي
                </span>
                <span className="text-[15px] font-semibold arabic-text" style={{ color: textColor }}>
                  100 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal arabic-text" style={{ color: secondaryColor }}>
                  وجبة الفطور
                </span>
                <span className="text-[15px] font-semibold arabic-text" style={{ color: secondaryColor }}>
                  10 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal arabic-text" style={{ color: secondaryColor }}>
                  بطاطا مقلية 2
                </span>
                <span className="text-[15px] font-semibold arabic-text" style={{ color: secondaryColor }}>
                  10 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal arabic-text" style={{ color: secondaryColor }}>
                  صوص هني مسترد
                </span>
                <span className="text-[15px] font-semibold arabic-text" style={{ color: secondaryColor }}>
                  10 ألف ل.س
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
