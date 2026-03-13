import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  
  // A "Ref" helps prevent the auto-save from running while we are still loading data
  const isInitialLoad = useRef(true);

  // 1. SYNC FROM DATABASE ON LOGIN
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?._id && token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (data.cart) {
            const formattedCart = data.cart.map(item => ({
              ...item.productId, 
              quantity: item.quantity
            }));
            
            // Mark that we are loading data so the "Auto-save" doesn't trigger immediately
            isInitialLoad.current = true; 
            setCart(formattedCart);
          }
        } catch (err) { console.error("Sync error", err); }
      } else {
        setCart([]);
      }
    };
    fetchUserData();
  }, [user?._id, token]); // Only re-run if ID or Token actually changes

  // 2. AUTO-SAVE TO DATABASE ON CHANGE
  useEffect(() => {
    // FIX: Don't save if it's the first load OR if there's no user
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (user?._id && token) {
      const dbItems = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      // Using a small timeout or debouncing here is better, but this works for now
      fetch(`${import.meta.env.VITE_API_URL}/api/users/cart/update`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: dbItems })
      });
    }
  }, [cart]); // Only trigger when the cart items change

  const addToCart = (product) => {
    if (!user) return alert("Please Login First!");
    
    setCart(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cartItems: cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);