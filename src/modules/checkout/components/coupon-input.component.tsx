import React, { useState } from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import type { Coupon } from '../types';

interface CouponInputProps {
    value: string;
    onChange: (value: string) => void;
    onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
    onRemoveCoupon: () => void;
    appliedCoupon?: Coupon;
    isLoading: boolean;
    error?: string;
}

export const CouponInput: React.FC<CouponInputProps> = ({
    value,
    onChange,
    onApplyCoupon,
    onRemoveCoupon,
    appliedCoupon,
    isLoading,
    error,
}) => {
    const [localError, setLocalError] = useState<string>('');
    const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();

    const handleApply = async () => {
        if (!value.trim()) return;

        setLocalError('');
        const result = await onApplyCoupon(value.trim());

        if (!result.success) {
            setLocalError(result.message);
        }
    };

    const handleRemove = () => {
        onRemoveCoupon();
        setLocalError('');
    };

    const displayError = error || localError;

    return (
        <div className="rounded-lg p-3" style={{ backgroundColor: backgroundColor, border: `1px solid ${secondaryColor}` }}>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="ادخل كود الحسم"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 text-sm arabic-text outline-none"
                    style={{ color: textColor, backgroundColor: backgroundColor }}
                    disabled={isLoading || !!appliedCoupon}
                />

                {appliedCoupon ? (
                    <button
                        onClick={handleRemove}
                        className="p-1"
                        style={{ color: accentColor }}
                        disabled={isLoading}
                    >
                        <svg className="w-4 h-4" fill="none" stroke={textColor} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={handleApply}
                        disabled={isLoading || !value.trim()}
                        className="px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: primaryColor, color: textColor }}
                    >
                        {isLoading ? '...' : 'تطبيق'}
                    </button>
                )}
            </div>

            {appliedCoupon && (
                <div className="mt-2 p-2 rounded text-sm" style={{ backgroundColor: secondaryColor, border: `1px solid ${secondaryColor}` }}>
                    <div className="flex items-center gap-2" style={{ color: textColor }}>
                        <svg className="w-4 h-4" fill="none" stroke={textColor} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="arabic-text">
                            تم تطبيق كوبون {appliedCoupon.code} - خصم {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue} ل.س`}
                        </span>
                    </div>
                </div>
            )}

            {displayError && (
                <div className="mt-2 p-2 rounded text-sm" style={{ backgroundColor: backgroundColor, border: `1px solid ${accentColor}` }}>
                    <div className="flex items-center gap-2" style={{ color: accentColor }}>
                        <svg className="w-4 h-4" fill="none" stroke={accentColor} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="arabic-text">{displayError}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
