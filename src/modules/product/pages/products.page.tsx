import React from 'react';
import { useProducts } from '../hooks';
import { PaginatedProductsComponent } from '../components';
import type { Product } from '../../../shared/types';

interface ProductsPageProps {
    whiteLabelConfig?: any;
    onProductClick?: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
    whiteLabelConfig,
    onProductClick,
}) => {
    const {
        computedData,
        isLoading,
        isError,
        errorMessage,
        // currentPage, pagination, hasProducts,
        goToPage,
    } = useProducts({
        initialPage: 1,
        initialLimit: 10,
    });

    const handleProductClick = (product: Product) => {
        if (onProductClick) {
            onProductClick(product);
        }
    };

    const handlePageChange = (page: number) => {
        goToPage(page);
    };

    if (isError) {
        return (
            <div
                className="w-full min-h-screen p-4"
                style={{ backgroundColor: whiteLabelConfig?.backgroundColor }}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-red-500 text-lg mb-2 arabic-text">
                            خطأ في تحميل المنتجات
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
        <div
            className="w-full min-h-screen p-4"
            style={{ backgroundColor: whiteLabelConfig?.backgroundColor }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold text-gray-800 mb-2 arabic-text"
                    >
                        جميع المنتجات
                    </h1>
                    <p
                        className="text-gray-600 arabic-text"
                    >
                        اكتشف جميع المنتجات المتاحة
                    </p>
                </div>

                {/* Products Content */}
                {computedData && (
                    <PaginatedProductsComponent
                        products={computedData.products}
                        pagination={computedData.pagination}
                        isLoading={isLoading}
                        onProductClick={handleProductClick}
                        onPageChange={handlePageChange}
                        whiteLabelConfig={whiteLabelConfig}
                    />
                )}
            </div>
        </div>
    );
};
