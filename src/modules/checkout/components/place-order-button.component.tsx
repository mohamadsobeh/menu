import React, { useState } from 'react';
import { PhoneCollectionModal } from './phone-collection-modal.component';
import type { PhoneNumberForm } from '../../../shared/types';

interface PlaceOrderButtonProps {
  onPlaceOrder: () => void;
  onPhoneSubmitted?: (phoneData: PhoneNumberForm) => void;
  onPhoneSkipped?: () => void;
  onOpenPaymentFooter?: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  onPlaceOrder,
  onPhoneSubmitted,
  onPhoneSkipped,
  onOpenPaymentFooter,
  isLoading,
  disabled,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPhoneCollection, setShowPhoneCollection] = useState(false);

  const handleButtonClick = () => {
    if (isLoading) return;
    setShowConfirmation(true);
  };

  const handleConfirmOrder = () => {
    setShowConfirmation(false);
    setShowPhoneCollection(true);
  };

  const handleCancelOrder = () => {
    setShowConfirmation(false);
  };

  const handlePhoneSubmitted = (phoneData: PhoneNumberForm) => {
    console.log("Phone number submitted:", phoneData);
    onPhoneSubmitted?.(phoneData);
    setShowPhoneCollection(false);
    onOpenPaymentFooter?.();
  };

  const handlePhoneSkipped = () => {
    console.log("Phone collection skipped");
    onPhoneSkipped?.();
    setShowPhoneCollection(false);
    onOpenPaymentFooter?.();
  };
  return (
    <>
      {/* Confirmation Bottom Sheet */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/45 bg-opacity-40 "
            onClick={handleCancelOrder}
          />

          {/* Bottom Sheet */}
          <div className="relative w-full bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 arabic-text">
                  تأكيد الطلب
                </h3>
                <button
                  onClick={handleCancelOrder}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-600 arabic-text text-center mb-4">
                  هل أنت متأكد من أنك تريد وضع هذا الطلب؟
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#50BF63] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 arabic-text mb-2">طلب آمن ومضمون</p>
                      <p className="text-sm text-gray-600 arabic-text">سيتم تأكيد طلبك فوراً</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleConfirmOrder}
                  className="w-full flex items-center justify-center bg-[#50BF63] text-white py-3 rounded-lg font-semibold arabic-text"
                >
                  نعم، أريد وضع الطلب
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="w-full flex items-center justify-center bg-gray-500 text-white  py-3 rounded-lg font-semibold arabic-text"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Collection Modal */}
      <PhoneCollectionModal
        isOpen={showPhoneCollection}
        onPhoneSubmitted={handlePhoneSubmitted}
        onSkip={handlePhoneSkipped}
      />

      {/* Place Order Button */}
      <div className="p-4 bg-white">
        <button
          onClick={handleButtonClick}
          disabled={disabled || isLoading}
          className="w-full bg-[#50BF63] text-white py-4 rounded-lg font-semibold arabic-text flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
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
            )}
          </div>
          <div className="text-center">
            <div className="text-lg">
              {isLoading ? 'جاري الطلب...' : 'ضع الطلب'}
            </div>
            {!isLoading && (
              <div className="text-sm opacity-90">مرر للتأكيد</div>
            )}
          </div>
        </button>
      </div>
    </>
  );
};
