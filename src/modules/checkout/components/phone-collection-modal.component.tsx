import React, { useState } from 'react';
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
        <div className="fixed inset-0 z-40 bg-white">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 py-2">
            <span className="text-sm font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-black rounded-sm"></div>
              <div className="w-4 h-2 bg-black rounded-sm"></div>
              <div className="w-4 h-2 bg-black rounded-sm"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-screen">
            {/* Illustration */}
            <div className="mb-8 relative">
              <div className="w-32 h-32 bg-[#50BF63] rounded-full flex items-center justify-center relative">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>

              {/* Speech Bubble */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 arabic-text text-center mb-4">
              ضيف رقمك وخلي تجربتك فريدة
            </h1>

            {/* Description */}
            <p className="text-gray-700 arabic-text text-center mb-8 leading-relaxed">
              بتوصلك العروض الحصرية أول بأول، وبتقدر تطلب بسرعة وبدون تعقيد!
            </p>

            {/* Phone Input */}
            <div className="w-full mb-8">
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 text-right arabic-text ${
                  error
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#50BF63]'
                } focus:outline-none`}
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 arabic-text text-right">
                  {error}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!phoneNumber.trim() || isLoading}
                className="w-full bg-[#50BF63] text-white py-4 rounded-lg font-semibold arabic-text disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري التحميل...' : 'تاكيد'}
              </button>

              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="w-full bg-gray-200 text-gray-800 py-4 rounded-lg font-semibold arabic-text disabled:opacity-50"
              >
                تخطي
              </button>
            </div>

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm arabic-text mb-2">
                اضافة المزيد من المعلومات ستعطيك حسومات حصرية
              </p>
              <button
                onClick={handleAddNow}
                className="text-[#50BF63] font-semibold arabic-text hover:underline"
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
