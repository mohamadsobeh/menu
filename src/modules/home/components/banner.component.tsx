import React from 'react';
import type { Banner } from '../../../shared/types';

interface BannerComponentProps {
  banners: Banner[];
  onBannerClick?: (banner: Banner) => void;
}

export const BannerComponent: React.FC<BannerComponentProps> = ({
  banners,
  onBannerClick
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null); const scrollTimeoutRef = React.useRef<number | undefined>(undefined);

  const handleBannerClick = (banner: Banner) => {
    if (onBannerClick) {
      onBannerClick(banner);
    } else if (banner.redirectUrl) {
      window.open(banner.redirectUrl, '_blank');
    }
  };

  const handleScroll = () => {
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to detect when scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      snapToNearestBanner();
    }, 150);
  };

  const snapToNearestBanner = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const bannerWidth = 352; // w-88 = 352px
    const gap = 12; // gap-3 = 12px
    const totalBannerWidth = bannerWidth + gap;

    // Calculate which banner should be fully visible
    const bannerIndex = Math.round(scrollLeft / totalBannerWidth);
    const targetScrollLeft = bannerIndex * totalBannerWidth;

    // Smooth scroll to the target position
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-screen -mx-4 mb-4 rounded-lg" style={{ background: 'linear-gradient(to bottom, #f3f4f6 0%, rgba(243, 244, 246, 0.8) 50%, rgba(243, 244, 246, 0) 100%)' }}>
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 pt-4 px-4 scrollbar-hide scroll-smooth"
        style={{ direction: 'ltr' }}
        onScroll={handleScroll}
      >
        {banners
          .filter(banner => banner.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((banner) => (
            <div
              key={banner.id}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleBannerClick(banner)}
            >
              <div className="w-88 h-40 bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt="Advertisement"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
