import { useState, useCallback } from 'react';
import { useCart } from '../../../shared/contexts';
import type { CheckoutState, TableOption, Coupon, CheckoutFormData, OrderRequest } from '../types';

export const useCheckout = () => {
    const { items, getTotalPrice, clearCart } = useCart();
    const [checkoutState, setCheckoutState] = useState<CheckoutState>({
        orderSummary: {
            items: [],
            subtotal: 0,
            discount: 0,
            total: 0,
        },
        isLoading: false,
    });

    const [formData, setFormData] = useState<CheckoutFormData>({
        tableNumber: '',
        couponCode: '',
        specialInstructions: '',
        customerName: '',
        customerPhone: '',
    });

    // Mock table options - in real app, this would come from API
    const tableOptions: TableOption[] = [
        { id: '1', number: 1, isAvailable: true, capacity: 4 },
        { id: '2', number: 2, isAvailable: true, capacity: 6 },
        { id: '3', number: 3, isAvailable: false, capacity: 2 },
        { id: '4', number: 4, isAvailable: true, capacity: 8 },
    ];

    // Mock coupon validation - in real app, this would call API
    const validateCoupon = useCallback(async (code: string): Promise<Coupon | null> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockCoupons: Coupon[] = [
            {
                id: '1',
                code: 'WELCOME10',
                discountType: 'percentage',
                discountValue: 10,
                minOrderAmount: 50000,
                isActive: true,
            },
            {
                id: '2',
                code: 'SAVE20',
                discountType: 'fixed',
                discountValue: 20000,
                minOrderAmount: 100000,
                isActive: true,
            },
        ];

        return mockCoupons.find(coupon => coupon.code === code) || null;
    }, []);

    const selectTable = useCallback((table: TableOption) => {
        setCheckoutState(prev => ({
            ...prev,
            selectedTable: table,
        }));
        setFormData(prev => ({
            ...prev,
            tableNumber: table.number.toString(),
        }));
    }, []);

    const applyCoupon = useCallback(async (code: string) => {
        setCheckoutState(prev => ({ ...prev, isLoading: true, error: undefined }));

        try {
            const coupon = await validateCoupon(code);

            if (coupon) {
                const subtotal = getTotalPrice();
                let discount = 0;

                if (coupon.discountType === 'percentage') {
                    discount = (subtotal * coupon.discountValue) / 100;
                    if (coupon.maxDiscountAmount) {
                        discount = Math.min(discount, coupon.maxDiscountAmount);
                    }
                } else {
                    discount = coupon.discountValue;
                }

                const total = Math.max(0, subtotal - discount);

                setCheckoutState(prev => ({
                    ...prev,
                    appliedCoupon: coupon,
                    orderSummary: {
                        ...prev.orderSummary,
                        discount,
                        total,
                        couponCode: code,
                    },
                    isLoading: false,
                }));

                setFormData(prev => ({
                    ...prev,
                    couponCode: code,
                }));

                return { success: true, message: 'Coupon applied successfully!' };
            } else {
                setCheckoutState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Invalid coupon code',
                }));
                return { success: false, message: 'Invalid coupon code' };
            }
        } catch (error) {
            setCheckoutState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to validate coupon',
            }));
            return { success: false, message: 'Failed to validate coupon' };
        }
    }, [getTotalPrice, validateCoupon]);

    const removeCoupon = useCallback(() => {
        const subtotal = getTotalPrice();
        setCheckoutState(prev => ({
            ...prev,
            appliedCoupon: undefined,
            orderSummary: {
                ...prev.orderSummary,
                discount: 0,
                total: subtotal,
                couponCode: undefined,
            },
        }));

        setFormData(prev => ({
            ...prev,
            couponCode: '',
        }));
    }, [getTotalPrice]);

    const updateOrderSummary = useCallback(() => {
        const subtotal = getTotalPrice();
        const discount = checkoutState.appliedCoupon ? checkoutState.orderSummary.discount : 0;
        const total = Math.max(0, subtotal - discount);

        setCheckoutState(prev => ({
            ...prev,
            orderSummary: {
                items,
                subtotal,
                discount,
                total,
                tableNumber: formData.tableNumber,
                couponCode: formData.couponCode,
            },
        }));
    }, [items, getTotalPrice, checkoutState.appliedCoupon, formData.tableNumber, formData.couponCode]);

    const prepareOrderRequest = useCallback((): OrderRequest => {
        return {
            items,
            tableNumber: formData.tableNumber,
            couponCode: formData.couponCode,
            specialInstructions: formData.specialInstructions,
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            totalAmount: checkoutState.orderSummary.total,
            subtotal: checkoutState.orderSummary.subtotal,
            discountAmount: checkoutState.orderSummary.discount,
        };
    }, [items, formData, checkoutState.orderSummary]);

    const resetCheckout = useCallback(() => {
        setCheckoutState({
            orderSummary: {
                items: [],
                subtotal: 0,
                discount: 0,
                total: 0,
            },
            isLoading: false,
        });
        setFormData({
            tableNumber: '',
            couponCode: '',
            specialInstructions: '',
            customerName: '',
            customerPhone: '',
        });
        clearCart();
    }, [clearCart]);

    return {
        checkoutState,
        formData,
        setFormData,
        tableOptions,
        selectTable,
        applyCoupon,
        removeCoupon,
        updateOrderSummary,
        prepareOrderRequest,
        resetCheckout,
    };
};
