import React from 'react';

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

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="relative w-full bg-white rounded-t-[16px] shadow-2xl">
        {/* Grabber */}
        <div className="flex justify-center py-2">
          <div className="w-[60px] h-[5px] rounded-[38px] bg-[#EEEFF1]" />
        </div>

        {/* Header */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-6 relative">
            <h3 className="text-[16px] font-bold text-[#303136] arabic-text mx-auto">
              تفاصيل الدفع
            </h3>
            <button
              onClick={onClose}
              className="absolute right-0 w-9 h-9 rounded-full flex items-center justify-center border border-[#EEEFF1] bg-[#FFFFFF]"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
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
            <div className="flex items-center justify-between w-[355px] h-[72px] border border-[#22D27B] rounded-[16px] px-6">
              <span className="text-[#48E095] font-bold text-[16px] arabic-text">
                رقم الطلب
              </span>
              <span className="text-[#22D27B] font-extrabold text-[32px] arabic-text">
                #{orderId}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Guide accordion */}
          <div className="mt-8 bg-[#F5F7F8] rounded-[12px] px-4 pt-3 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-[#000000] text-[14px] arabic-text">
                دليل الدفع
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#070300]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
            <ul className="space-y-3 text-[12px] leading-relaxed text-[#B5B9C4] arabic-text list-disc pr-5 marker:text-[#242422]">
              <li>عند انتهاء الاختيار يضغط المستخدم على إتمام الطلب.</li>
              <li>تظهر فاتورة تفصيلية مع زر تأكيد الطلب.</li>
              <li>بعد التأكيد يظهر رقم الطلب بشكل واضح.</li>
              <li>سيظهر رقم الطلب بشكل واضح على الشاشة.</li>
              <li>توجه إلى الكاشير وقدّم رقم الطلب للدفع.</li>
            </ul>

            {/* Contact button */}
            <button
              onClick={onPlaceOrder} // ✅ إذا تم تمريره يستعمله
              className="w-full h-[34px] bg-[#22D27B] text-white rounded-[12px] 
                font-medium text-[16px] leading-none arabic-text mt-8 
                flex items-center justify-center"
            >
              تواصل معنا
            </button>
          </div>

          {/* Order details */}
          <div className="mt-8 w-full px-4">
            <h4 className="text-[24px] font-semibold text-[#000000] arabic-text flex items-center justify-center mb-5">
              تفاصيل الطلب
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[17px] font-semibold text-[#303136] arabic-text">
                  المجموع الكلي
                </span>
                <span className="text-[15px] font-semibold text-[#303136] arabic-text">
                  130 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[17px] font-semibold text-[#303136] arabic-text">
                  المجموع الفرعي
                </span>
                <span className="text-[15px] font-semibold text-[#303136] arabic-text">
                  100 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal text-[#626471] arabic-text">
                  وجبة الفطور
                </span>
                <span className="text-[15px] font-semibold text-[#626471] arabic-text">
                  10 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal text-[#626471] arabic-text">
                  بطاطا مقلية 2
                </span>
                <span className="text-[15px] font-semibold text-[#626471] arabic-text">
                  10 ألف ل.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal text-[#626471] arabic-text">
                  صوص هني مسترد
                </span>
                <span className="text-[15px] font-semibold text-[#626471] arabic-text">
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
