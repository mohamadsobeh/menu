import React from 'react';
import type { WhiteLabelConfig } from '../../../shared/types';

interface FooterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  whiteLabelConfig?: WhiteLabelConfig | null;
}

export const FooterBottomSheet: React.FC<FooterBottomSheetProps> = ({
  isOpen,
  onClose,
  whiteLabelConfig,
}) => {
  if (!isOpen) return null;

  // 🟢 Helper function لعمل fallback
  const getColor = (color?: string, fallback: string = '#303136') => {
    if (!color) return fallback;
    const normalized = color.startsWith('#') ? color.toUpperCase() : `#${color.toUpperCase()}`;
    return normalized === '#FFFFFF' ? '#000000' : normalized; // إذا أبيض → أسود
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 bg-opacity-40"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="relative w-full rounded-t-2xl shadow-2xl"
        style={{ backgroundColor: whiteLabelConfig?.backgroundColor || '#F5F5DC' }}
      >
        {/* Indicator */}
        <div className="flex justify-center py-2">
          <div className="w-[67px] h-[5px] rounded-[32px] bg-[#EEEFF1]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-1">
          <button onClick={onClose} className="p-2"></button>
          <span className="w-6" />
        </div>

        {/* Main Content */}
        <div className="px-6 pt-2 pb-6">
          <h4 className="text-[16px] font-bold mb-6 arabic-text text-center flex justify-center items-center"
            style={{ color: getColor(whiteLabelConfig?.textColor) }}>
            يمكنك متابعتي على
          </h4>

          <div className="space-y-6">
            {/* Website */}
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center ml-3"
                style={{
                  backgroundColor: whiteLabelConfig?.accentColor || '#50BF63',
                }}
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <span
                className="font-medium"
                style={{ color: getColor(whiteLabelConfig?.textColor) }}
              >
                Msar.Live
              </span>
            </div>

            {/* Phone */}
            {whiteLabelConfig?.contactPhone && (
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center ml-3"
                  style={{
                    backgroundColor: whiteLabelConfig?.accentColor || '#50BF63',
                  }}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span
                  className="font-medium"
                  style={{ color: getColor(whiteLabelConfig?.textColor) }}
                >
                  {whiteLabelConfig.contactPhone}
                </span>
              </div>
            )}

            {/* Email */}
            {whiteLabelConfig?.contactEmail && (
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center ml-3"
                  style={{
                    backgroundColor: whiteLabelConfig?.accentColor || '#50BF63',
                  }}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span
                  className="font-medium"
                  style={{ color: getColor(whiteLabelConfig?.textColor) }}
                >
                  {whiteLabelConfig.contactEmail}
                </span>
              </div>
            )}

            {/* Instagram */}
            {whiteLabelConfig?.instagramAccount && (
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center ml-3"
                  style={{
                    backgroundColor: whiteLabelConfig?.accentColor || '#50BF63',
                  }}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                  </svg>
                </div>
                <span
                  className="font-medium"
                  style={{ color: getColor(whiteLabelConfig?.textColor) }}
                >
                  {whiteLabelConfig.instagramAccount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
