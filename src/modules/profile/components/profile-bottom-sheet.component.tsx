import React from 'react';

interface ProfileBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onOrdersClick?: () => void;
}

export const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
    isOpen,
    onClose,
    onOrdersClick,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="relative w-full h-[100vh] bg-white rounded-t-2xl shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-[#EBEBEB]">
                    <button onClick={onClose} className="p-2">
                        <svg
                            className="w-6 h-6 text-[#303136]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h2 className="text-[38px] font-semibold text-black arabic-text">
                        مرحباً، سمير
                    </h2>
                    <span className="w-6" />
                </div>

                {/* Content */}
                <div className="px-5 py-6 space-y-8">
                    {/* General */}
                    <div>
                        <h3 className="text-base font-bold text-black arabic-text mb-4">
                            عامّة
                        </h3>
                        <button
                            onClick={onOrdersClick}
                            className="w-full flex items-center justify-between py-3 border-b border-[#EBEBEB] hover:bg-gray-50 transition-colors"
                        >
                            <span className="arabic-text">طلباتي</span>
                            <svg
                                className="w-5 h-5 text-[#303136]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7h18M3 12h18M3 17h18"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Personal */}
                    <div>
                        <h3 className="text-base font-bold text-black arabic-text mb-4">
                            شخصي
                        </h3>
                        {/* Name */}
                        <div className="flex items-center justify-between py-3 border-b border-[#EBEBEB]">
                            <button className="text-[#2ECC71] text-sm arabic-text">عدّل</button>
                            <div className="flex-1 mx-3 text-right arabic-text">
                                محمد الجراح
                            </div>
                            <svg
                                className="w-5 h-5 text-[#303136]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        {/* Phone */}
                        <div className="flex items-center justify-between py-3 border-b border-[#EBEBEB]">
                            <button className="text-[#2ECC71] text-sm arabic-text">عدّل</button>
                            <div className="flex-1 mx-3 text-right arabic-text">
                                +963943394968
                            </div>
                            <svg
                                className="w-5 h-5 text-[#303136]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5h18M8 5v14m8-14v14M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        {/* Email */}
                        <div className="flex items-center justify-between py-3 border-b border-[#EBEBEB]">
                            <button className="text-[#2ECC71] text-sm arabic-text">عدّل</button>
                            <div className="flex-1 mx-3 text-right arabic-text">
                                Demo@Gamain.com
                            </div>
                            <svg
                                className="w-5 h-5 text-[#303136]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 12H8m8 0l-8-6m8 6l-8 6"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Other */}
                    <div>
                        <h3 className="text-base font-bold text-black arabic-text mb-4">
                            أُخرى
                        </h3>
                        <div className="flex items-center justify-between py-3 border-b border-[#EBEBEB]">
                            <span className="arabic-text">إعدادات الحساب</span>
                            <svg
                                className="w-5 h-5 text-[#303136]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.75 3a1 1 0 011 1v1.09a7.5 7.5 0 013.5 0V4a1 1 0 112 0v1.09a7.5 7.5 0 012.121 1.213l.773-.773a1 1 0 111.414 1.414l-.773.773A7.5 7.5 0 0120.91 10H22a1 1 0 110 2h-1.09a7.5 7.5 0 01-1.213 2.121l.773.773a1 1 0 11-1.414 1.414l-.773-.773A7.5 7.5 0 0114 18.91V20a1 1 0 11-2 0v-1.09a7.5 7.5 0 01-2.121-1.213l-.773.773a1 1 0 11-1.414-1.414l.773-.773A7.5 7.5 0 013.09 12H2a1 1 0 110-2h1.09a7.5 7.5 0 011.213-2.121l-.773-.773a1 1 0 111.414-1.414l.773.773A7.5 7.5 0 017.999 5.09V4a1 1 0 011-1z"
                                />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-[#EBEBEB]">
                            <span className="arabic-text">الخصوصية</span>
                            <svg
                                className="w-5 h-5 text-[#303136]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4zM6 22a6 6 0 1112 0H6z"
                                />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="arabic-text">الدعم</span>
                            <svg
                                className="w-5 h-5 text-[#303136]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Logout */}
                    <div>
                        <button className="w-full text-right text-red-600 arabic-text flex items-center justify-between">
                            <span className="arabic-text">تسجيل الخروج</span>
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
