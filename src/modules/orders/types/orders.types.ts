export type OrderStatus = 'in_progress' | 'completed' | 'cancelled';

export interface OrderItemDetail {
    id: string;
    name: string;
    price: string;
    quantity: number;
}

export interface OrderDetails {
    id: string;
    subtotal: string;
    total: string;
    items: OrderItemDetail[];
    status: OrderStatus;
    timestamp: string;
}

export interface Order {
    id: string;
    itemName: string;
    price: string;
    status: OrderStatus;
    timestamp: string;
    imageUrl?: string;
}

export interface OrdersState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    selectedFilter: OrderStatus | 'all';
}

export interface OrdersBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onViewOrderDetails?: (orderId: string) => void;
}

export interface OrderDetailsBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
}
