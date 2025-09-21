import React from 'react';
import type { Category, WhiteLabelConfig } from '../../../shared/types';

interface StickyCategoriesNavProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
  isVisible: boolean;
  whiteLabelConfig?: WhiteLabelConfig | null;
}

export const StickyCategoriesNav: React.FC<StickyCategoriesNavProps> = ({
  categories,
  onCategoryClick,
  onSearchClick,
  onProfileClick,
  isVisible,
  whiteLabelConfig
}) => {
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 ease-in-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      }`}
    >
             {/* Header Row - Same as original header */}
       <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 ml-2">
          {whiteLabelConfig?.logo_url && (
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img
                src={whiteLabelConfig.logo_url}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <button
            onClick={onSearchClick}
            className="px-3 py-1.5 border border-[#50BF63] rounded-lg text-[#50BF63] text-sm font-medium arabic-text hover:bg-[#50BF63] hover:text-white transition-colors duration-200"
          >
            تابعنا
          </button>
        </div>
        
        {/* Right side icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSearchClick}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <button
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center relative"
          >
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
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#50BF63] rounded-full"></div>
          </button>
        </div>
      </div>
      
      {/* Categories Row - Below header */}
      <div className="px-4 py-3">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category)}
              className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 arabic-text whitespace-nowrap hover:bg-gray-200 transition-colors duration-200"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
