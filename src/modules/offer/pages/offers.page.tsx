import React from 'react';
import { useOffers } from '../hooks';
import { PaginatedOffersComponent } from '../components';
import type { Offer } from '../../../shared/types';

interface OffersPageProps {
    whiteLabelConfig?: any;
    onOfferClick?: (offer: Offer) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
    whiteLabelConfig,
    onOfferClick,
}) => {
    const {
        computedData,
        isLoading,
        isError,
        errorMessage,
        currentPage,
        pagination,
        hasOffers,
        goToPage,
    } = useOffers({
        initialPage: 1,
        initialLimit: 10,
    });

    const handleOfferClick = (offer: Offer) => {
        if (onOfferClick) {
            onOfferClick(offer);
        }
    };

    const handlePageChange = (page: number) => {
        goToPage(page);
    };

    if (isError) {
        return (
            <div className="w-full min-h-screen bg-white p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-red-500 text-lg mb-2 arabic-text">
                            خطأ في تحميل العروض
                        </div>
                        <div className="text-gray-500 text-sm arabic-text">
                            {errorMessage || 'حدث خطأ غير متوقع'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold text-gray-800 mb-2 arabic-text"
                        style={{ fontFamily: whiteLabelConfig?.fontFamily || 'inherit' }}
                    >
                        العروض المتاحة
                    </h1>
                    <p
                        className="text-gray-600 arabic-text"
                        style={{ fontFamily: whiteLabelConfig?.fontFamily || 'inherit' }}
                    >
                        اكتشف أحدث العروض والخصومات المتاحة
                    </p>
                </div>

                {/* Offers Content */}
                {computedData && (
                    <PaginatedOffersComponent
                        offers={computedData.offers}
                        pagination={computedData.pagination}
                        isLoading={isLoading}
                        onOfferClick={handleOfferClick}
                        onPageChange={handlePageChange}
                        whiteLabelConfig={whiteLabelConfig}
                    />
                )}
            </div>
        </div>
    );
};
