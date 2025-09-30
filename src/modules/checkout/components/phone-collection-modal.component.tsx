import React, { useState } from 'react';
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
  const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();

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
      console.log('Submitting phone number:', phoneNumber);

      await new Promise(resolve => setTimeout(resolve, 1000));

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
    console.log('User details submitted:', data);
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

  return (
    <>
      {/* Main Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: backgroundColor }}>
          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 py-2">
            <span className="text-sm font-medium" style={{ color: textColor }}>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: textColor || undefined }}></div>
              <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: textColor || undefined }}></div>
              <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: textColor || undefined }}></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-screen">
            {/* Illustration */}
            <div className="mb-8 relative">
              <div className="w-32 h-32 rounded-full flex items-center justify-center relative" style={{ backgroundColor: primaryColor }}>
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: textColor }}
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>

              {/* Speech Bubble */}
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: textColor }}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold arabic-text text-center mb-4" style={{ color: textColor }}>
              ضيف رقمك وخلي تجربتك فريدة
            </h1>

            {/* Description */}
            <p className="arabic-text text-center mb-8 leading-relaxed" style={{ color: secondaryColor }}>
              بتوصلك العروض الحصرية أول بأول، وبتقدر تطلب بسرعة وبدون تعقيد!
            </p>

            {/* Phone Input */}
            <div className="w-full mb-8">
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 text-right arabic-text focus:outline-none`}
                style={{ borderColor: error ? '#ef4444' : secondaryColor, color: textColor, backgroundColor: backgroundColor, outlineColor: primaryColor }}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm mt-2 arabic-text text-right" style={{ color: accentColor }}>
                  {error}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!phoneNumber.trim() || isLoading}
                className="w-full py-4 rounded-lg font-semibold arabic-text disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor, color: textColor }}
              >
                {isLoading ? 'جاري التحميل...' : 'تاكيد'}
              </button>

              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="w-full py-4 rounded-lg font-semibold arabic-text disabled:opacity-50"
                style={{ backgroundColor: secondaryColor, color: textColor }}
              >
                تخطي
              </button>
            </div>

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-sm arabic-text mb-2" style={{ color: secondaryColor }}>
                اضافة المزيد من المعلومات ستعطيك حسومات حصرية
              </p>
              <button
                onClick={handleAddNow}
                className="font-semibold arabic-text hover:underline"
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
