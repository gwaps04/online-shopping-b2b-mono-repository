"use client";

// Woz Fix: Imported useCallback to freeze function references
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => { success: boolean; message: string };
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  currencySymbol: string;
  formatPrice: (amount: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, activeCurrency }: { children: ReactNode, activeCurrency: string }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const CURRENCY_SYMBOLS: Record<string, string> = { "USD": "$", "PHP": "₱", "EUR": "€", "GBP": "£" };
  const currencySymbol = CURRENCY_SYMBOLS[activeCurrency] || "$";

  // Woz Fix: Memoize formatPrice
  const formatPrice = useCallback((amount: number) => {
    return `${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currencySymbol]);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("shopping_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error("Failed to parse cart", e); }
    }
  }, []);

  useEffect(() => {
    if (isMounted) { localStorage.setItem("shopping_cart", JSON.stringify(cart)); }
  }, [cart, isMounted]);

  // Woz Fix: Memoize addToCart
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    let result = { success: true, message: "Added to cart!" };
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      let currentQuantity = existingItemIndex >= 0 ? prevCart[existingItemIndex].quantity : 0;

      if (currentQuantity >= 10) {
        result = { success: false, message: "Maximum limit of 10 reached for this item." };
        return prevCart;
      }

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    return result;
  }, []);

  // Woz Fix: Memoize removeFromCart
  const removeFromCart = useCallback((id: string) => {
    setCart(prevCart => prevCart.filter((item) => item.id !== id));
  }, []);

  // Woz Fix: Memoize updateQuantity
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const safeQuantity = quantity > 10 ? 10 : quantity;
    setCart(prevCart => prevCart.map((item) => (item.id === id ? { ...item, quantity: safeQuantity } : item)));
  }, [removeFromCart]);

  // Woz Fix: Memoize clearCart (This specifically fixes the Checkout browser crash)
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, currencySymbol, formatPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
}