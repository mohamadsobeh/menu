import React from 'react';
import type { WhiteLabelConfig } from '../../../shared/types';

interface HeaderComponentProps {
  whiteLabelConfig?: WhiteLabelConfig | null;
  onFollowUsClick?: () => void;
  onProfileClick?: () => void;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
  whiteLabelConfig,
  onFollowUsClick,
  onProfileClick,
}) => {
  const handleFollowUsClick = () => {
    if (onFollowUsClick) {
      onFollowUsClick();
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <div className="w-full flex items-center justify-between mb-4">
      {/* Left side - Logo and Follow Us button */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        {whiteLabelConfig?.logoUrl && (
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src={whiteLabelConfig.logoUrl}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Follow Us button */}
        <button
          onClick={handleFollowUsClick}
          className="px-3 py-1.5 border rounded-lg text-sm font-medium arabic-text transition-colors duration-200"
          style={{
            borderColor: whiteLabelConfig?.primaryColor || '#50BF63',
            color: whiteLabelConfig?.primaryColor || '#50BF63',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              whiteLabelConfig?.primaryColor || '#50BF63';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color =
              whiteLabelConfig?.primaryColor || '#50BF63';
          }}
        >
          تابعنا
        </button>
      </div>

      {/* Right side - Profile icon */}
      <button
        onClick={handleProfileClick}
        className="w-10 h-10 rounded-full flex items-center justify-center relative"
        style={{
          backgroundColor: whiteLabelConfig?.secondaryColor || '#E5E7EB', // خلفية الأيقونة
        }}
      >
        {/* Profile icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={whiteLabelConfig?.textColor || '#374151'} // لون الأيقونة مربوط
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" />
        </svg>

        {/* Notification dot */}
        <div
          className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: whiteLabelConfig?.accentColor || '#50BF63',
          }}
        ></div>
      </button>
    </div>
  );
};
