import React from 'react';
import { useProductsByCategory } from '../hooks';
import { ProductsByCategoryComponent } from '../components';
import type { Product } from '../../../shared/types';

interface ProductsByCategoryPageProps {
    categoryId: number;
    categoryName?: string;
    whiteLabelConfig?: any;
    onProductClick?: (product: Product) => void;
}

export const ProductsByCategoryPage: React.FC<ProductsByCategoryPageProps> = ({
    categoryId,
    categoryName,
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
    } = useProductsByCategory({
        categoryId,
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
                            خطأ في تحميل منتجات الفئة
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
                {/* Products Content */}
                {computedData && (
                    <ProductsByCategoryComponent
                        products={computedData.products}
                        pagination={computedData.pagination}
                        isLoading={isLoading}
                        onProductClick={handleProductClick}
                        onPageChange={handlePageChange}
                        whiteLabelConfig={whiteLabelConfig}
                        categoryName={categoryName}
                    />
                )}
            </div>
        </div>
    );
};
