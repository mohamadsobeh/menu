import React, { useState } from 'react';

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
        <div className="fixed inset-0 z-50 bg-white">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="relative w-full h-[100vh] bg-white rounded-t-2xl shadow-2xl flex flex-col">
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 arabic-text">
                            إضافة المزيد من المعلومات
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
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

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#F4F6F8] rounded-lg text-[#8B8DA0] arabic-text focus:outline-none focus:ring-2 focus:ring-[#50BF63] focus:bg-white transition-colors"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="الاسم الكامل"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 bg-[#F4F6F8] rounded-lg text-[#8B8DA0] arabic-text focus:outline-none focus:ring-2 focus:ring-[#50BF63] focus:bg-white transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer (fixed buttons at bottom) */}
                <div className="p-6  border-[#EBEBEB] space-y-3">
                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        disabled={!email.trim() || !fullName.trim() || isLoading}
                        className="w-full flex items-center justify-center bg-[#50BF63] text-white py-3 rounded-xl font-semibold arabic-text disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'جاري التحميل...' : 'تأكيد'}
                    </button>

                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-[#DFE1E6] text-[#787B8A] py-3 rounded-xl font-semibold arabic-text disabled:opacity-50"
                    >
                        رجوع
                    </button>
                </div>
            </div>
        </div>
    );
};
