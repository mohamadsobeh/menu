import { useState, useEffect } from 'react';
import type { OrderDetails } from '../types';

// Mock data for order details
const mockOrderDetails: { [key: string]: OrderDetails } = {
    '1': {
        id: '1',
        subtotal: '120 الف ل س',
        total: '130 الف ل س',
        status: 'in_progress',
        timestamp: 'PM 2:50 2025 9 ابريل',
        items: [
            { id: 'item1', name: 'وجبة الفطور', price: '100 الف ل س', quantity: 1 },
            { id: 'item2', name: 'بطاطا مقلية 2', price: '10 الف ل س', quantity: 1 },
            { id: 'item3', name: 'صوص هني مسترد', price: '10 الف ل س', quantity: 1 },
            { id: 'item4', name: 'مشروب غازي', price: '10 الف ل س', quantity: 1 },
        ],
    },
    '2': {
        id: '2',
        subtotal: '90 الف ل س',
        total: '100 الف ل س',
        status: 'completed',
        timestamp: 'PM 1:30 2025 8 ابريل',
        items: [
            { id: 'item1', name: 'برجر لحم', price: '80 الف ل س', quantity: 1 },
            { id: 'item2', name: 'بطاطا مقلية', price: '10 الف ل س', quantity: 1 },
        ],
    },
    '3': {
        id: '3',
        subtotal: '50 الف ل س',
        total: '60 الف ل س',
        status: 'cancelled',
        timestamp: 'PM 3:15 2025 7 ابريل',
        items: [
            { id: 'item1', name: 'ساندويتش دجاج', price: '50 الف ل س', quantity: 1 },
        ],
    },
};

export const useOrderDetails = (orderId: string | null) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            setIsLoading(true);
            setError(null);

            // Simulate API call
            setTimeout(() => {
                console.log('Looking for order details with ID:', orderId);
                console.log('Available order details:', Object.keys(mockOrderDetails));
                const details = mockOrderDetails[orderId];
                if (details) {
                    console.log('Found order details:', details);
                    setOrderDetails(details);
                } else {
                    console.log('Order details not found for ID:', orderId);
                    // For debugging, let's create a default order detail
                    const defaultOrderDetails: OrderDetails = {
                        id: orderId,
                        subtotal: '100 الف ل س',
                        total: '100 الف ل س',
                        status: 'in_progress',
                        timestamp: 'PM 2:50 2025 9 ابريل',
                        items: [
                            { id: 'item1', name: 'وجبة الفطور', price: '100 الف ل س', quantity: 1 },
                        ],
                    };
                    console.log('Using default order details:', defaultOrderDetails);
                    setOrderDetails(defaultOrderDetails);
                }
                setIsLoading(false);
            }, 500);
        } else {
            setOrderDetails(null);
            setError(null);
        }
    }, [orderId]);

    const getStatusText = (status: string) => {
        switch (status) {
            case 'in_progress':
                return 'جاري العمل عليه';
            case 'completed':
                return 'مكتملة';
            case 'cancelled':
                return 'ملغاة';
            default:
                return '';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress':
                return 'text-green-600';
            case 'completed':
                return 'text-black';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return {
        orderDetails,
        isLoading,
        error,
        getStatusText,
        getStatusColor,
    };
};
