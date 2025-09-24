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
        {whiteLabelConfig?.logo_url && (
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src={whiteLabelConfig.logo_url}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Follow Us button */}
        <button
          onClick={handleFollowUsClick}
          className="px-3 py-1.5 border border-[#50BF63] rounded-lg text-[#50BF63] text-sm font-medium arabic-text hover:bg-[#50BF63] hover:text-white transition-colors duration-200"
        >
          تابعنا
        </button>
      </div>

      {/* Right side - Profile icon */}
      <button
        onClick={handleProfileClick}
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center relative"
      >
        {/* Profile icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            fill="#374151"
          />
          <path
            d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
            fill="#374151"
          />
        </svg>
        
        {/* Notification dot */}
        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#50BF63] rounded-full"></div>
      </button>
    </div>
  );
};
