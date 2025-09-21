import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  onBackClick?: () => void;
  shouldUnfocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search...", 
  onSearch,
  value = "",
  onFocus,
  onBlur,
  isFocused = false,
  onBackClick,
  shouldUnfocus = true
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleClear = () => {
    if (onSearch) {
      onSearch('');
    }
  };

  const handleFocus = () => {
    // Notify parent component that search is focused
    if (onFocus) {
      onFocus();
    }
    
    // Scroll to search bar when focused on mobile
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);
  };



  const handleBlur = () => {
    // Add a small delay to check if the blur is due to clicking on product elements
    setTimeout(() => {
      // Check if the active element is still within the search area or if we should maintain focus
      const activeElement = document.activeElement;
      const searchContainer = inputRef.current?.closest('.search-container');
      
      // Only unfocus if shouldUnfocus is true, there's no search text, and we're not clicking within search area
      if (shouldUnfocus && !value.trim() && (!searchContainer || !searchContainer.contains(activeElement))) {
        if (onBlur) {
          onBlur();
        }
      }
    }, 100);
  };

  const handleBackClick = () => {
    // Force unfocus regardless of state
    if (inputRef.current) {
      inputRef.current.blur();
    }
    // Always call onBackClick to force unfocus
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <div className="w-full px-0.3 py-4 ml-4 search-container">
      <div className="relative w-full flex items-center">
        {/* Back Arrow - Only show when focused */}
        {isFocused && (
          <button
            onClick={handleBackClick}
            className="ml-4 p-2 rounded-full bg-[#50BF63] hover:bg-[#45a556] transition-colors duration-200 flex-shrink-0"
          >
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        )}
        
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-9 py-3 rounded-lg border-none outline-none text-gray-700 placeholder-gray-500 arabic-text"
            style={{ backgroundColor: '#F5F7F8' }}
            dir="rtl"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          
          {/* Clear button */}
          {value && (
            <button
              onClick={handleClear}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg 
                className="w-5 h-5" 
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
          )}
        </div>
      </div>
    </div>
  );
};
