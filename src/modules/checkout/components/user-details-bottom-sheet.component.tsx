import React, { useState } from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import { X } from "lucide-react";
interface UserDetailsBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { email: string; fullName: string }) => void;
    onBack: () => void;
}

export const UserDetailsBottomSheet: React.FC<UserDetailsBottomSheetProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onBack,
}) => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { backgroundColor, primaryColor, secondaryColor, textColor } = useWhiteLabelColors();

    const handleConfirm = async () => {
        if (!email.trim() || !fullName.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            console.log('Submitting user details:', { email, fullName });
            await new Promise(resolve => setTimeout(resolve, 1000));
            onConfirm({ email: email.trim(), fullName: fullName.trim() });
        } catch (error) {
            console.error('Failed to submit user details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        onBack();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" style={{ backgroundColor: backgroundColor }}>
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="relative w-full h-[100vh] rounded-t-2xl shadow-2xl flex flex-col" style={{ backgroundColor: backgroundColor }}>
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    

{/* Header */}
{/* زر الإغلاق (X) */}
<div className="absolute top-8 left-12">
  <button
    onClick={onClose}
    className="absolute"
  >
    <X
      size={24}       
      strokeWidth={2.5}  
      color={textColor}  
    />
  </button>
</div>

{/* الحقول */}
<div className="space-y-6 w-full max-w-[376px] mx-auto mt-[72px]">
  {/* البريد الإلكتروني */}
  <div>
    <input
      type="email"
      placeholder="البريد الإلكتروني"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="
        w-full h-[64px] 
        rounded-[16px] 
        px-[18px] py-[20px] 
        arabic-text text-right
        text-[16px] font-medium
        focus:outline-none focus:ring-2 transition-colors
        placeholder:font-medium
      "
      style={{
        backgroundColor: secondaryColor,
        color: textColor,
        outlineColor: primaryColor,
      }}
      disabled={isLoading}
    />
  </div>

  {/* الاسم الكامل */}
  <div>
    <input
      type="text"
      placeholder="الاسم الكامل"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      className="
        w-full h-[64px] 
        rounded-[16px] 
        px-[18px] py-[20px] 
        arabic-text text-right
        text-[16px] font-medium
        focus:outline-none focus:ring-2 transition-colors
        placeholder:font-medium
      "
      style={{
        backgroundColor: secondaryColor,
        color: textColor,
        outlineColor: primaryColor,
      }}
      disabled={isLoading}
    />
  </div>
</div>


                </div>

                {/* Footer (fixed buttons at bottom) */}
                <div className="p-6  space-y-3" style={{ borderColor: secondaryColor }}>
                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        disabled={!email.trim() || !fullName.trim() || isLoading}
                        className="w-full flex items-center justify-center py-3 rounded-xl font-semibold arabic-text disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        style={{ backgroundColor: primaryColor, color: textColor }}
                    >
                        {isLoading ? 'جاري التحميل...' : 'تأكيد'}
                    </button>

                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-3 rounded-xl font-semibold arabic-text disabled:opacity-50 mb-10"
                        style={{ backgroundColor: secondaryColor, color: textColor }}
                    >
                        رجوع
                    </button>
                </div>
            </div>
        </div>
    );
};
