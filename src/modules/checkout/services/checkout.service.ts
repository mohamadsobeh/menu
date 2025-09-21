import type { OrderRequest, OrderResponse, Coupon, TableOption } from '../types';

export interface CheckoutService {
    // Order management
    placeOrder(order: OrderRequest): Promise<OrderResponse>;
    getOrderStatus(orderId: string): Promise<OrderResponse>;
    cancelOrder(orderId: string): Promise<boolean>;

    // Table management
    getAvailableTables(): Promise<TableOption[]>;
    reserveTable(tableId: string, duration: number): Promise<boolean>;
    releaseTable(tableId: string): Promise<boolean>;

    // Coupon management
    validateCoupon(code: string): Promise<Coupon | null>;
    getActiveCoupons(): Promise<Coupon[]>;
}

// Mock implementation - replace with real API calls
export class MockCheckoutService implements CheckoutService {
    async placeOrder(order: OrderRequest): Promise<OrderResponse> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock response
        return {
            orderId: `ORD-${Date.now()}`,
            status: 'pending',
            estimatedTime: 15,
            message: 'Order placed successfully!',
        };
    }

    async getOrderStatus(orderId: string): Promise<OrderResponse> {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock different statuses based on order ID
        const statuses: OrderResponse['status'][] = ['pending', 'confirmed', 'preparing', 'ready'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return {
            orderId,
            status: randomStatus,
            estimatedTime: randomStatus === 'ready' ? 0 : 10,
        };
    }

    async cancelOrder(orderId: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async getAvailableTables(): Promise<TableOption[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        return [
            { id: '1', number: 1, isAvailable: true, capacity: 4 },
            { id: '2', number: 2, isAvailable: true, capacity: 6 },
            { id: '3', number: 3, isAvailable: false, capacity: 2 },
            { id: '4', number: 4, isAvailable: true, capacity: 8 },
            { id: '5', number: 5, isAvailable: true, capacity: 10 },
        ];
    }

    async reserveTable(tableId: string, duration: number): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async releaseTable(tableId: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
    }

    async validateCoupon(code: string): Promise<Coupon | null> {
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
            {
                id: '3',
                code: 'NEWUSER',
                discountType: 'percentage',
                discountValue: 15,
                minOrderAmount: 30000,
                maxDiscountAmount: 50000,
                isActive: true,
            },
        ];

        return mockCoupons.find(coupon =>
            coupon.code === code && coupon.isActive
        ) || null;
    }

    async getActiveCoupons(): Promise<Coupon[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        return [
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
    }
}

// Export singleton instance
export const checkoutService = new MockCheckoutService();
