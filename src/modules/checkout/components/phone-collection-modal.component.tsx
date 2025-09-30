import React, { useState, useRef } from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import { UserDetailsBottomSheet } from './user-details-bottom-sheet.component';
import type { PhoneNumberForm } from '../../../shared/types';

interface PhoneCollectionModalProps {
  isOpen: boolean;
  onPhoneSubmitted: (phoneData: PhoneNumberForm) => void;
  onSkip: () => void;
}

export const PhoneCollectionModal: React.FC<PhoneCollectionModalProps> = ({
  isOpen,
  onPhoneSubmitted,
  onSkip,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } =
    useWhiteLabelColors();

  const touchStartY = useRef<number | null>(null);

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setError(undefined);
  };

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onPhoneSubmitted({
        phoneNumber: phoneNumber.trim(),
        countryCode: '+963',
      });
    } catch (err) {
      setError('فشل في إرسال رقم الهاتف');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleAddNow = () => {
    setShowUserDetails(true);
  };

  const handleUserDetailsConfirm = (data: { email: string; fullName: string }) => {
    console.log('User details confirmed:', data);
    setShowUserDetails(false);
    onPhoneSubmitted({
      phoneNumber: phoneNumber.trim(),
      countryCode: '+963',
    });
  };

  const handleUserDetailsBack = () => {
    setShowUserDetails(false);
  };

  const handleUserDetailsClose = () => {
    setShowUserDetails(false);
  };

  // 👇 إضافة السحب
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchEndY - touchStartY.current;

      if (diffY > 80) {
        // إذا سحب لتحت أكثر من 80px → أغلق المودال
        onSkip();
      }
    }
    touchStartY.current = null;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor }}
        >
          {/* Main Content مع السحب */}
          <div
            className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 min-h-screen max-w-[388px] w-full mx-auto overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Illustration */}
            <div className="mb-6 sm:mb-8 relative flex justify-center">
              <img
                src="/images/Group.png"
                alt="Group illustration"
                className="w-40 sm:w-48 md:w-56 h-auto object-cover mb-6"
              />
            </div>

            {/* Title */}
            <h1
              className="flex items-center justify-center w-full text-[18px] font-bold arabic-text mb-6 sm:mb-4"
              style={{ color: textColor }}
            >
              ضيف رقمك وخلي تجربتك فريدة
            </h1>

            {/* Description */}
            <p className="w-full text-center mb-6">
              <span
                className="block text-[14px] font-normal font-alexandria arabic-text leading-[100%] tracking-[-0.04em]"
                style={{ color: secondaryColor }}
              >
                بتوصلك العروض الحصرية أول بأول، وبتقدر تطلب بسرعة
              </span>
              <span
                className="flex items-center justify-center text-[16px] font-normal font-alexandria arabic-text leading-[100%] tracking-[-0.04em]"
                style={{ color: secondaryColor }}
              >
                وبدون تعقيد!
              </span>
            </p>

            {/* Phone Input */}
            <div className="w-full mb-6 sm:mb-8">
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full h-[64px] px-4 rounded-lg border text-right arabic-text focus:outline-none text-[16px] font-medium mt-4"
                style={{
                  borderColor: error ? '#ef4444' : secondaryColor,
                  color: textColor,
                  backgroundColor,
                  outlineColor: primaryColor,
                }}
                disabled={isLoading}
              />
              {error && (
                <p
                  className="text-sm mt-2 arabic-text text-right"
                  style={{ color: accentColor }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={handleSubmit}
                disabled={!phoneNumber.trim() || isLoading}
                className="w-full h-[50px] rounded-[12px] flex items-center justify-center font-medium text-[16px] arabic-text disabled:opacity-50 disabled:cursor-not-allowed border-[1.5px]"
                style={{
                  backgroundColor: primaryColor,
                  color: '#FFFFFF',
                  borderColor: primaryColor,
                }}
              >
                {isLoading ? 'جاري التحميل...' : 'تأكيد'}
              </button>

              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="w-full h-[50px] rounded-[12px] flex items-center justify-center font-medium text-[16px] arabic-text disabled:opacity-50"
                style={{
                  backgroundColor: secondaryColor,
                  color: '#78788A',
                }}
              >
                تخطي
              </button>
            </div>

            {/* Footer Text */}
            <div className="flex flex-col items-center justify-center w-full mt-3">
              <p
                className="flex items-center justify-center mb-4 w-full text-[12px] font-normal font-alexandria arabic-text leading-[100%] tracking-[-0.04em] mb-1 text-right"
                style={{ color: secondaryColor }}
              >
                اضافة المزيد من المعلومات ستعطيك حسومات حصرية
              </p>

              <button
                onClick={handleAddNow}
                className="text-[12px] font-bold font-alexandria arabic-text leading-[100%] tracking-[-0.04em] text-center"
                style={{ color: primaryColor }}
              >
                اضف الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Bottom Sheet */}
      <UserDetailsBottomSheet
        isOpen={showUserDetails}
        onClose={handleUserDetailsClose}
        onConfirm={handleUserDetailsConfirm}
        onBack={handleUserDetailsBack}
      />
    </>
  );
};
