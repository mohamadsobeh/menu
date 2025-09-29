import React, { useEffect } from 'react';
import { useHomeScreen } from '../hooks';
import { SearchBar, BannerComponent, CategoriesListComponent, HeaderComponent, StickyCategoriesNav, FooterBottomSheet } from '../components';
import { OfferDetailsSheet, useOfferDetailsSheet, OfferCarouselComponent, useRecommendedOffers } from '../../offer';
import { ProductDetailsSheet, useProductDetailsSheet } from '../../product-details';
import type { Banner, Offer, Product, Category } from '../../../shared/types';
import { ShimmerHomeScreen, FlyingAnimation, FloatingCartButton, Toast } from '../../../shared/components';
import { ProfileBottomSheet } from '../../profile';
import { OrdersBottomSheet, OrderDetailsBottomSheet } from '../../orders';
import { AssessmentBottomSheet } from '../../assessment';
import { useWhiteLabel } from '../../../providers/white-label-provider';

interface HomeScreenPageProps {
  restaurantId: number;
}

export const HomeScreenPage: React.FC<HomeScreenPageProps> = ({ restaurantId }) => {
  const { setWhiteLabelConfig } = useWhiteLabel();
  const {
    isLoading,
    isFetching,
    isError,
    errorMessage,
    activeBanners,
    sortedCategories,
    whiteLabelConfig,
    refetch,
  } = useHomeScreen(restaurantId);

  // Set whiteLabelConfig in global context when it changes
  useEffect(() => {
    if (whiteLabelConfig) {
      setWhiteLabelConfig(whiteLabelConfig);
    }
  }, [whiteLabelConfig, setWhiteLabelConfig]);

  // Use the dedicated recommended offers API
  const {
    computedData: recommendedOffersData,
  } = useRecommendedOffers({
    initialPage: 1,
    initialLimit: 10,
  });

  // Get featured products for the selected offer
  const getFeaturedProductsForOffer = React.useCallback((offer: Offer | null) => {
    if (!offer) return [];

    // Since the new Offer type doesn't include products, return empty array
    return [];
  }, []);

  const {
    selectedOffer,
    isOpen: isOfferDetailsOpen,
    openOfferDetails,
    closeOfferDetails
  } = useOfferDetailsSheet();

  const {
    selectedProduct,
    categoryImageUrl,
    isOpen: isProductSheetOpen,
    openProductDetails,
    closeProductDetails
  } = useProductDetailsSheet();

  const [isSearchBarVisible, setIsSearchBarVisible] = React.useState(true);
  const [showStickyNav, setShowStickyNav] = React.useState(false);
  const [headerRef, setHeaderRef] = React.useState<HTMLDivElement | null>(null);
  const [mainContainerRef, setMainContainerRef] = React.useState<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [shouldUnfocusSearch, setShouldUnfocusSearch] = React.useState(true);
  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const handleBannerClick = (_banner: Banner) => {
  };

  const handleOfferClick = (offer: Offer) => {
    openOfferDetails(offer);
  };

  const handleProductClick = (product: Product, categoryImageUrl?: string) => {
    console.log("Clicked product:", product);
    console.log("isAvailable value:", product?.isAvailable);

    if (product?.isAvailable === true) {
      openProductDetails(product, categoryImageUrl);
    } else {
      showToast('هذا المنتج غير متوفر حالياً', 'warning');
    }
  };

  const handleCategoryClick = (_category: Category) => {
  };

  const handleFollowUsClick = () => {
    setIsFooterSheetOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileSheetOpen(true);
  };

  const handleOrdersClick = () => {
    setIsOrdersSheetOpen(true);
  };

  const handleViewOrderDetails = (orderId: string) => {
    console.log('Opening order details for ID:', orderId);
    setSelectedOrderId(orderId);
    setIsOrderDetailsSheetOpen(true);
  };

  const handleAssessmentClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsAssessmentSheetOpen(true);
  };

  const handleAssessmentSubmitted = (data: any) => {
    console.log('Assessment submitted:', data);
    showToast('تم إرسال التقييم بنجاح', 'success');
    setIsAssessmentSheetOpen(false);
    setSelectedOrderId(null);
  };

  const handleShowOrders = () => {
    console.log('handleShowOrders called - opening orders sheet');
    console.log('Current state before change:', {
      isAssessmentSheetOpen,
      isOrderDetailsSheetOpen,
      isOrdersSheetOpen
    });
    setIsAssessmentSheetOpen(false);
    setIsOrderDetailsSheetOpen(false);
    setSelectedOrderId(null);
    setIsOrdersSheetOpen(true);
    console.log('Orders sheet should now be open');
  };

  const [isProfileSheetOpen, setIsProfileSheetOpen] = React.useState(false);
  const [isOrdersSheetOpen, setIsOrdersSheetOpen] = React.useState(false);
  const [isOrderDetailsSheetOpen, setIsOrderDetailsSheetOpen] = React.useState(false);
  const [isAssessmentSheetOpen, setIsAssessmentSheetOpen] = React.useState(false);
  const [isFooterSheetOpen, setIsFooterSheetOpen] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const closeProfileSheet = () => setIsProfileSheetOpen(false);
  const closeOrdersSheet = () => setIsOrdersSheetOpen(false);
  const closeOrderDetailsSheet = () => {
    setIsOrderDetailsSheetOpen(false);
    setSelectedOrderId(null);
  };
  const closeAssessmentSheet = () => {
    setIsAssessmentSheetOpen(false);
    setSelectedOrderId(null);
  };
  const closeFooterSheet = () => setIsFooterSheetOpen(false);

  const handleSearchClick = () => {
    setIsSearchBarVisible(true);
    setShowStickyNav(false);
    // Scroll to header
    if (headerRef) {
      headerRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStickyCategoryClick = (category: Category) => {
    // Find the category element and scroll to it
    const categoryElement = document.querySelector(`[data-category-id="${category.id}"]`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter categories and products based on search query
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedCategories;
    }

    const query = searchQuery.toLowerCase().trim();

    return sortedCategories.map(category => ({
      ...category,
      products: category.products.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    })).filter(category => category.products.length > 0);
  }, [sortedCategories, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShouldUnfocusSearch(true);
  };

  const handleSearchBlur = () => {
    // Force unfocus when back button is clicked
    setIsSearchFocused(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Scroll event handler
  React.useEffect(() => {
    const handleScroll = () => {
      if (!headerRef) {
        return;
      }

      const headerRect = headerRef.getBoundingClientRect();
      const isHeaderOutOfView = headerRect.bottom < 0;

      setIsSearchBarVisible(!isHeaderOutOfView);
      setShowStickyNav(isHeaderOutOfView);
    };

    if (mainContainerRef) {
      mainContainerRef.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Also add to window as backup
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set up state
    handleScroll();

    return () => {
      if (mainContainerRef) {
        mainContainerRef.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerRef, mainContainerRef]);

  if (isLoading) {
    return <ShimmerHomeScreen />;
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <div className="text-red-600 text-lg mb-4 arabic-text">خطأ: {errorMessage}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-white rounded arabic-text"
          style={{ backgroundColor: whiteLabelConfig?.primaryColor }}
          onMouseEnter={(e) => {
            if (whiteLabelConfig?.accentColor) {
              e.currentTarget.style.backgroundColor = whiteLabelConfig.accentColor;
            }
          }}
          onMouseLeave={(e) => {
            if (whiteLabelConfig?.primaryColor) {
              e.currentTarget.style.backgroundColor = whiteLabelConfig.primaryColor;
            }
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setMainContainerRef}
      className="w-full h-full min-h-screen overflow-y-auto"
      style={{ backgroundColor: whiteLabelConfig?.backgroundColor }}
    >
      {/* Background refresh indicator */}
      {isFetching && (
        <div className="fixed top-4 left-4 px-3 py-1 rounded text-sm z-50 arabic-text text-white" style={{ backgroundColor: whiteLabelConfig?.primaryColor }}>
          جاري التحديث...
        </div>
      )}

      {/* Sticky Categories Navigation */}
      <StickyCategoriesNav
        categories={sortedCategories}
        onCategoryClick={handleStickyCategoryClick}
        onSearchClick={handleSearchClick}
        onProfileClick={handleProfileClick}
        isVisible={showStickyNav}
        whiteLabelConfig={whiteLabelConfig}
      />

      {/* Main Content */}
      <div className="w-full min-h-full p-4">

        {/* Header and Search Bar Container */}
        <div ref={setHeaderRef}>
          {/* Header Component */}
          <HeaderComponent
            whiteLabelConfig={whiteLabelConfig}
            onFollowUsClick={handleFollowUsClick}
            onProfileClick={handleProfileClick}
          />

          {/* Search Bar */}
          {isSearchBarVisible && (
            <SearchBar
              placeholder="عن ماذا تبحث"
              onSearch={handleSearch}
              value={searchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              isFocused={isSearchFocused}
              onBackClick={handleSearchBlur}
              shouldUnfocus={shouldUnfocusSearch}
            />
          )}
        </div>

        {/* Banner Component */}
        {activeBanners.length > 0 && !isSearchFocused && (
          <BannerComponent
            banners={activeBanners}
            onBannerClick={handleBannerClick}
          />
        )}

        {/* Recommended Offers Component */}
        {!isSearchFocused && (
          <OfferCarouselComponent
            offers={recommendedOffersData?.recommendedOffers || []}
            onOfferClick={handleOfferClick}
          />
        )}

        {/* Categories List Component - Show in normal view or when search is focused */}
        {(!isSearchFocused || searchQuery.trim()) && (
          <CategoriesListComponent
            categories={isSearchFocused ? filteredCategories : sortedCategories}
            onProductClick={handleProductClick}
            onCategoryClick={handleCategoryClick}
            whiteLabelConfig={whiteLabelConfig}
          />
        )}

        {/* No results message */}
        {searchQuery.trim() && filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="text-gray-500 text-lg mb-2 arabic-text animate-slide-up">
              لا توجد نتائج لـ "{searchQuery}"
            </div>
            <div className="text-gray-400 text-sm arabic-text animate-slide-up" style={{ animationDelay: '0.2s' }}>
              جرب البحث بكلمات مختلفة
            </div>
          </div>
        )}

        {/* Flying Animation */}
        <FlyingAnimation />

        {/* Floating Cart Button */}
        <FloatingCartButton whiteLabelConfig={whiteLabelConfig} />

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
          duration={3000}
        />

        {/* Offer Details Sheet */}
        <OfferDetailsSheet
          offer={selectedOffer}
          featuredProducts={getFeaturedProductsForOffer(selectedOffer)}
          isOpen={isOfferDetailsOpen}
          onClose={closeOfferDetails}
        />

        {/* Product Details Sheet */}
        <ProductDetailsSheet
          product={selectedProduct}
          categoryImageUrl={categoryImageUrl}
          isOpen={isProductSheetOpen}
          onClose={closeProductDetails}
        />

        {/* Profile Bottom Sheet */}
        <ProfileBottomSheet
          isOpen={isProfileSheetOpen}
          onClose={closeProfileSheet}
          onOrdersClick={handleOrdersClick}
        />

        {/* Orders Bottom Sheet */}
        <OrdersBottomSheet
          isOpen={isOrdersSheetOpen}
          onClose={closeOrdersSheet}
          onViewOrderDetails={handleViewOrderDetails}
        />

        {/* Order Details Bottom Sheet */}
        <OrderDetailsBottomSheet
          isOpen={isOrderDetailsSheetOpen}
          onClose={closeOrderDetailsSheet}
          orderId={selectedOrderId}
          onAssessmentClick={handleAssessmentClick}
        />

        {/* Assessment Bottom Sheet */}
        <AssessmentBottomSheet
          isOpen={isAssessmentSheetOpen}
          onClose={closeAssessmentSheet}
          orderId={selectedOrderId}
          onAssessmentSubmitted={handleAssessmentSubmitted}
          onShowOrders={handleShowOrders}
        />

        {/* Footer Bottom Sheet */}
        <FooterBottomSheet
          isOpen={isFooterSheetOpen}
          onClose={closeFooterSheet}
          whiteLabelConfig={whiteLabelConfig}
        />

        {/* Extra space to ensure scrolling */}
        <div className="h-96"></div>

      </div>
    </div>
  );
};
