import { useState, useEffect } from 'react';
import type { Order, OrdersState, OrderStatus } from '../types';

const mockOrders: Order[] = [
    {
        id: '1',
        itemName: 'اجنحة دجاج كريمية',
        price: '100 الف ل س',
        status: 'in_progress',
        timestamp: '',
        imageUrl: '/images/food-sample.jpg'
    },
    {
        id: '2',
        itemName: 'اجنحة دجاج كريمية',
        price: '100 الف ل س',
        status: 'cancelled',
        timestamp: 'PM 2:50 2025 9 ابريل',
        imageUrl: '/images/food-sample.jpg'
    },
    {
        id: '3',
        itemName: 'اجنحة دجاج كريمية',
        price: '100 الف ل س',
        status: 'completed',
        timestamp: 'PM 2:50 2025 9 ابريل',
        imageUrl: '/images/food-sample.jpg'
    }
];

export const useOrders = () => {
    const [state, setState] = useState<OrdersState>({
        orders: [],
        isLoading: true,
        error: null,
        selectedFilter: 'all'
    });

    useEffect(() => {
        // Simulate API call
        const loadOrders = async () => {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                setState(prev => ({
                    ...prev,
                    orders: mockOrders,
                    isLoading: false
                }));
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to load orders',
                    isLoading: false
                }));
            }
        };

        loadOrders();
    }, []);

    const setSelectedFilter = (filter: OrderStatus | 'all') => {
        setState(prev => ({ ...prev, selectedFilter: filter }));
    };

    const getFilteredOrders = () => {
        if (state.selectedFilter === 'all') {
            return state.orders;
        }
        return state.orders.filter(order => order.status === state.selectedFilter);
    };

    const getStatusText = (status: OrderStatus) => {
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

    const getStatusColor = (status: OrderStatus) => {
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
        ...state,
        filteredOrders: getFilteredOrders(),
        setSelectedFilter,
        getStatusText,
        getStatusColor
    };
};
