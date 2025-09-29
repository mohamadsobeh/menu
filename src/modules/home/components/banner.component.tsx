import React from 'react';
import type { Banner } from '../../../shared/types';

interface BannerComponentProps {
  banners: Banner[];
  onBannerClick?: (banner: Banner) => void;
  whiteLabelConfig?: any; // أضفنا هذا للـ colors & background
}

export const BannerComponent: React.FC<BannerComponentProps> = ({
  banners,
  onBannerClick,
  whiteLabelConfig
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = React.useRef<number | undefined>(undefined);

  const handleBannerClick = (banner: Banner) => {
    if (onBannerClick) {
      onBannerClick(banner);
    } else if (banner.redirectUrl) {
      window.open(banner.redirectUrl, '_blank');
    }
  };

  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
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

    const bannerIndex = Math.round(scrollLeft / totalBannerWidth);
    const targetScrollLeft = bannerIndex * totalBannerWidth;

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
    <div
      className="w-screen -mx-4 mb-4 rounded-lg"
      style={{
        background: whiteLabelConfig?.backgroundColor
          ? whiteLabelConfig.backgroundColor
          : whiteLabelConfig?.secondaryColor
            ? `linear-gradient(to bottom, ${whiteLabelConfig.secondaryColor} 0%, ${whiteLabelConfig.secondaryColor}80 50%, ${whiteLabelConfig.secondaryColor}00 100%)`
            : undefined
      }}
    >
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
              <div
                className="w-88 h-40 rounded-xl shadow-md overflow-hidden"
                style={{
                  backgroundColor: whiteLabelConfig?.secondaryColor
                }}
              >
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
