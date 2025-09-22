import React, { useState } from 'react';
import { useAssessment } from '../hooks';
import { ThankYouAssessmentBottomSheet } from './thank-you-assessment-bottom-sheet.component';
import type { AssessmentBottomSheetProps, Rating } from '../types';

export const AssessmentBottomSheet: React.FC<AssessmentBottomSheetProps> = ({
    isOpen,
    onClose,
    orderId,
    onAssessmentSubmitted,
    onShowOrders,
}) => {
    const [showThankYou, setShowThankYou] = useState(false);

    const {
        rating,
        recommendation,
        comment,
        isSubmitting,
        error,
        setRating,
        setRecommendation,
        setComment,
        submitAssessment,
    } = useAssessment();

    if (!isOpen) return null;

    const handleSubmit = () => {
        setShowThankYou(true);
        if (orderId) {
            submitAssessment(orderId, onAssessmentSubmitted, () => { });
        }
    };

    const handleThankYouClose = () => {
        setShowThankYou(false);
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starNumber = (index + 1) as Rating;
            const isFilled = rating && starNumber <= rating;

            return (
                <button
                    key={starNumber}
                    onClick={() => setRating(starNumber)}
                    className="focus:outline-none"
                >
                    <svg
                        className={`w-8 h-8 transition-colors ${isFilled ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </button>
            );
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            <div className="relative w-full h-[100vh] bg-white rounded-t-2xl shadow-2xl flex flex-col">
                <div className="flex justify-between items-center px-4 py-2">
                    <span className="text-sm font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364A9 9 0 015 12C5 7.029 9.029 3 14 3c.833 0 1.64.11 2.415.312M15 11a3 3 0 11-6 0 3 3 0 016 0zm-7 4h4m-4 0a7 7 0 007 7h-4a7 7 0 01-7-7z" />
                        </svg>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center justify-center px-4 py-5  border-[#EBEBEB] relative">
                    <h2 className="text-[24px] font-semibold text-black arabic-text">
                        التقييم
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 p-2 text-[#303136]"
                    >
                        <svg
                            className="w-6 h-6 rotate-0"
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
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                            <div className="flex items-center space-x-1">
                                <div className="w-6 h-4 bg-gray-600 rounded-sm"></div>
                                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                                <div className="w-4 h-6 bg-green-500 rounded-t-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h3 className=" flex justify-center  text-[18px]  font-semibold text-black arabic-text">
                            كيف كانت تجربتك؟
                        </h3>
                        <div className="flex justify-center space-x-2 ">
                            {renderStars()}
                        </div>
                        <div className="border-b border-[#ebebeb]"></div>
                    </div>

                    <div className=" text-center space-y-4">
                        <p className="flex justify-center text-[16px] text-gray-700 arabic-text">
                            وجبة فطور كاملة الدسم 20 قطعة
                        </p>
                        <h4 className="flex justify-center text-[16px] font-semibold text-black arabic-text">
                            هل تنصح الآخرين بهذا الطبق؟
                        </h4>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setRecommendation('no')}
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${recommendation === 'no'
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 bg-white'
                                    }`}
                            >
                                <svg
                                    className={`w-6 h-6 ${recommendation === 'no' ? 'text-red-500' : 'text-gray-400'
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={() => setRecommendation('yes')}
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${recommendation === 'yes'
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300 bg-white'
                                    }`}
                            >
                                <svg
                                    className={`w-6 h-6 ${recommendation === 'yes' ? 'text-white' : 'text-gray-400'
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </button>
                        </div>

                    </div>
                    <div className="border-b border-[#ebebeb]"></div>

                    <div className="space-y-3">
                        <h4 className="text-[20px] font-medium text-black arabic-text text-right">
                            اضف ملاحظة
                        </h4>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="اي تفضيلات محددة؟"
                            className="w-full h-[145px] p-4 bg-[#F5F7F8] rounded-[16px] resize-none focus:outline-none focus:ring-2 focus:ring-[#50BF63] arabic-text text-right text-[16px] text-[#A1A5B3] placeholder-[#A1A5B3]"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center arabic-text">
                            {error}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border-t border-[#EBEBEB]">
                    <button
                        onClick={handleSubmit}
                        disabled={!rating || isSubmitting}
                        className="w-[376px] h-[62px] mx-auto flex items-center justify-center 
               bg-[#22D27B] text-white text-[16px] font-bold 
               rounded-full shadow-sm hover:bg-[#1CB56A] transition-colors 
               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'جاري الإرسال...' : 'تأكيد'}
                    </button>
                </div>

            </div>

            <ThankYouAssessmentBottomSheet
                isOpen={showThankYou}
                onClose={handleThankYouClose}
                onShowOrders={onShowOrders}
            />
        </div>
    );
};
