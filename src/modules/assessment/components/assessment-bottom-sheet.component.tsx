import React, { useState } from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import { useAssessment } from '../hooks';
import { ThankYouAssessmentBottomSheet } from './thank-you-assessment-bottom-sheet.component';
import type { AssessmentBottomSheetProps, Rating } from '../types';
import { ArrowLeft, ThumbsDown, ThumbsUp } from 'lucide-react';

export const AssessmentBottomSheet: React.FC<AssessmentBottomSheetProps> = ({
  isOpen,
  onClose,
  orderId,
  onAssessmentSubmitted,
  onShowOrders,
}) => {
  const [showThankYou, setShowThankYou] = useState(false);
  const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();

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

  // ✅ سلايدر الصور
  const images = [
    '/images/meal1.png',
    '/images/meal2.png',
    '/images/meal3.png',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    setShowThankYou(true);
    if (orderId) {
      submitAssessment(orderId, onAssessmentSubmitted, () => {});
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
            className={`w-8 h-8 transition-colors ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
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
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-md sm:max-w-lg h-[100vh] shadow-2xl overflow-y-auto"
        style={{ backgroundColor }}
      >
        {/* العنوان */}
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onClose} className="p-3">
            <ArrowLeft className="w-7 h-7" stroke={textColor} />
          </button>
          <h2
            className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold arabic-text"
            style={{ color: textColor }}
          >
            التقييم
          </h2>
          <span className="w-12" />
        </div>

        {/* المحتوى */}
        <div className="flex justify-center items-center min-h-screen">
          <div
            className="w-full max-w-[373px] min-h-[718px] rounded-2xl shadow-lg overflow-hidden"
            style={{ backgroundColor: backgroundColor }}
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* الأيقونة العلوية */}
              <div className="flex justify-center">
                <div
                  className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-6 h-4 rounded-sm"
                      style={{ backgroundColor: textColor }}
                    ></div>
                    <div
                      className="w-1 h-6 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div
                      className="w-4 h-6 rounded-t-full"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* النصوص والنجوم */}
              <div className="text-center space-y-3">
                <h3
                  className="flex justify-center items-center text-[16px] sm:text-[18px] font-semibold arabic-text"
                  style={{ color: textColor }}
                >
                  كيف كانت تجربتك؟
                </h3>

                {/* النجوم */}
                <div className="flex justify-center gap-2 text-[28px] sm:text-[32px]">
                  {renderStars()}
                </div>
              </div>

              {/* التوصية */}
              <div className="text-center space-y-4">
                {/* ✅ السلايدر */}
                <div className="relative w-full max-w-[324px] mx-auto flex items-center justify-center">
                  {/* زر يسار */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* الصورة */}
                  <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex}`}
                    className="w-[62px] h-[62px] object-cover rounded-lg border mx-2"
                  />

                  {/* زر يمين */}
                  <button
                    onClick={handleNext}
                    className="absolute right-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* النصوص */}
                
  <p
    className="flex justify-center items-center text-[14px] font-medium arabic-text"
    style={{ color: secondaryColor }}
  >
    وجبة فطور كاملة الدسم 20 قطعة
  </p>

  <h4
    className="flex justify-center items-center text-[18px] font-semibold arabic-text"
    style={{ color: textColor }}
  >
    هل تنصح الآخرين بهذا الطبق
  </h4>




                {/* أزرار نعم / لا */}
                

<div className="flex justify-center gap-6">
   {/* زر نعم */}
   <button
    onClick={() => setRecommendation("yes")}
    className={`w-[60px] h-[60px] rounded-[30px] flex items-center justify-center transition-colors`}
    style={{
      backgroundColor:
        recommendation === "yes" ? primaryColor : backgroundColor,
      border: `2px solid ${
        recommendation === "yes" ? primaryColor : secondaryColor
      }`,
    }}
  >
    <ThumbsUp
      size={28}
      stroke={recommendation === "yes" ? textColor : secondaryColor}
    />
  </button>
  {/* زر لا */}
  <button
    onClick={() => setRecommendation("no")}
    className={`w-[60px] h-[60px] rounded-[30px] flex items-center justify-center transition-colors`}
    style={{
      backgroundColor:
        recommendation === "no" ? secondaryColor : backgroundColor,
      border: `2px solid ${
        recommendation === "no" ? accentColor : secondaryColor
      }`,
    }}
  >
    <ThumbsDown
      size={28}
      stroke={recommendation === "no" ? accentColor : secondaryColor}
    />
  </button>

 
</div>

              </div>

              <div className="border-b" style={{ borderColor: secondaryColor }} />

              {/* ملاحظات */}
              <div className="space-y-3">
                <h4
                  className="text-[20px] font-medium arabic-text text-right"
                  style={{ color: textColor }}
                >
                  اضف ملاحظة
                </h4>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اي تفضيلات محددة؟"
                  className="w-full h-[145px] p-4 rounded-[16px] resize-none focus:outline-none focus:ring-2 arabic-text text-right text-[16px]"
                  style={{
                    backgroundColor: secondaryColor,
                    color: textColor,
                    outlineColor: primaryColor,
                  }}
                />
              </div>

              {error && (
                <div
                  className="text-sm text-center arabic-text"
                  style={{ color: accentColor }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* زر التأكيد */}
        <div
  className="p-4 sm:p-6 flex justify-center"
  style={{ backgroundColor }}
>
  <button
    onClick={handleSubmit}
    disabled={!rating || isSubmitting}
    className="w-[376px] h-[62px] rounded-[50px] flex items-center justify-center text-[16px] font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    style={{
      backgroundColor: primaryColor,
      color: textColor,
      
    }}
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
