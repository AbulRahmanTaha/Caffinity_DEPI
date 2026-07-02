import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(JSON.parse(localStorage.getItem('cart')!) ?? []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    updateLocalStorage();
  }, [cartItems])

  const updateLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });
    toast.success(`${product.name} added to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item._id === productId);
      if (itemToRemove) {
        toast.error(`${itemToRemove.name} removed from cart.`);
      }
      return prevItems.filter(item => item._id !== productId)
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
