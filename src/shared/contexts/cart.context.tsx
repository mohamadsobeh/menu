import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ProductAddition } from '../types';

export interface CartItem {
  [x: string]: string | number | ProductAddition[] | undefined;
  id: string;
  name: string;
  price_in_syp: number;
  price_in_usd: number;
  image_url: string;
  type: 'product' | 'offer';
  quantity: number;
  selectedAdditions?: ProductAddition[];
}

interface CartState {
  items: CartItem[];
  flyingAnimations: Array<{
    id: string;
    imageUrl: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }>;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string; selectedAdditions?: ProductAddition[] } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; selectedAdditions?: ProductAddition[]; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_FLYING_ANIMATION'; payload: { id: string; imageUrl: string; startX: number; startY: number; endX: number; endY: number } }
  | { type: 'REMOVE_FLYING_ANIMATION'; payload: string };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Create a unique key for the cart item based on product ID and selected additions
      const createItemKey = (item: CartItem) => {
        const additionsKey = item.selectedAdditions
          ? item.selectedAdditions.map(add => add.id).sort().join(',')
          : '';
        return `${item.id}-${additionsKey}`;
      };

      const newItemKey = createItemKey(action.payload);
      const existingItem = state.items.find(item => createItemKey(item) === newItemKey);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            createItemKey(item) === newItemKey
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }
    case 'REMOVE_ITEM': {
      const createItemKey = (item: CartItem) => {
        const additionsKey = item.selectedAdditions
          ? item.selectedAdditions.map(add => add.id).sort().join(',')
          : '';
        return `${item.id}-${additionsKey}`;
      };

      const targetKey = createItemKey({
        id: action.payload.id,
        selectedAdditions: action.payload.selectedAdditions
      } as CartItem);

      return {
        ...state,
        items: state.items.filter(item => createItemKey(item) !== targetKey)
      };
    }
    case 'UPDATE_QUANTITY': {
      const createItemKey = (item: CartItem) => {
        const additionsKey = item.selectedAdditions
          ? item.selectedAdditions.map(add => add.id).sort().join(',')
          : '';
        return `${item.id}-${additionsKey}`;
      };

      const targetKey = createItemKey({
        id: action.payload.id,
        selectedAdditions: action.payload.selectedAdditions
      } as CartItem);

      return {
        ...state,
        items: state.items.map(item =>
          createItemKey(item) === targetKey
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    case 'ADD_FLYING_ANIMATION':
      return {
        ...state,
        flyingAnimations: [...state.flyingAnimations, action.payload]
      };
    case 'REMOVE_FLYING_ANIMATION':
      return {
        ...state,
        flyingAnimations: state.flyingAnimations.filter(anim => anim.id !== action.payload)
      };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  flyingAnimations: Array<{
    id: string;
    imageUrl: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }>;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, selectedAdditions?: ProductAddition[]) => void;
  updateQuantity: (id: string, quantity: number, selectedAdditions?: ProductAddition[]) => void;
  clearCart: () => void;
  addFlyingAnimation: (id: string, imageUrl: string, startX: number, startY: number, endX: number, endY: number) => void;
  removeFlyingAnimation: (id: string) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    flyingAnimations: []
  });

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string, selectedAdditions?: ProductAddition[]) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, selectedAdditions } });
  };

  const updateQuantity = (id: string, quantity: number, selectedAdditions?: ProductAddition[]) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, selectedAdditions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addFlyingAnimation = (id: string, imageUrl: string, startX: number, startY: number, endX: number, endY: number) => {
    dispatch({ type: 'ADD_FLYING_ANIMATION', payload: { id, imageUrl, startX, startY, endX, endY } });
  };

  const removeFlyingAnimation = (id: string) => {
    dispatch({ type: 'REMOVE_FLYING_ANIMATION', payload: id });
  };

  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      const basePrice = item.price_in_syp * item.quantity;
      const additionsPrice = item.selectedAdditions
        ? item.selectedAdditions.reduce((addTotal, addition) => addTotal + parseFloat(addition.priceSyp), 0) * item.quantity
        : 0;
      return total + basePrice + additionsPrice;
    }, 0);
  };

  const getItemCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        flyingAnimations: state.flyingAnimations,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        addFlyingAnimation,
        removeFlyingAnimation,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
