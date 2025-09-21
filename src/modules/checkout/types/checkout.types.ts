export interface TableOption {
    id: string;
    number: number;
    isAvailable: boolean;
    capacity?: number;
}

export interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    isActive: boolean;
    validUntil?: Date;
}

import type { ProductAddition } from '../../../shared/types';

export interface OrderItem {
    id: string;
    name: string;
    price_in_syp: number;
    price_in_usd: number;
    image_url: string;
    type: 'product' | 'offer';
    quantity: number;
    selectedAdditions?: ProductAddition[];
}

export interface OrderSummary {
    items: OrderItem[];
    subtotal: number;
    discount: number;
    total: number;
    tableNumber?: string;
    couponCode?: string;
}

export interface CheckoutState {
    selectedTable?: TableOption;
    appliedCoupon?: Coupon;
    orderSummary: OrderSummary;
    isLoading: boolean;
    error?: string;
}

export interface CheckoutFormData {
    tableNumber: string;
    couponCode: string;
    specialInstructions?: string;
    customerName?: string;
    customerPhone?: string;
}

export interface OrderRequest {
    items: OrderItem[];
    tableNumber?: string;
    couponCode?: string;
    specialInstructions?: string;
    customerName?: string;
    customerPhone?: string;
    totalAmount: number;
    subtotal: number;
    discountAmount: number;
}

export interface OrderResponse {
    orderId: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    estimatedTime?: number; // in minutes
    message?: string;
}

