import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  
  const blockSave = useRef(true);

  // Helper to ensure URL is clean (no double slashes)
  const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return url.endsWith('/') ? url.slice(0, -1) : url;
  };

  // 1. SYNC FROM DATABASE ON LOGIN
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id || !token) {
        setCart([]);
        setIsLoaded(false);
        blockSave.current = true;
        return;
      }

      try {
        const res = await fetch(`${getBaseUrl()}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Safety: Check if response is actually JSON
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.cart) {
            const formattedCart = data.cart
              .filter(item => item.productId) // Skip broken medicine references
              .map(item => ({
                ...item.productId, 
                quantity: item.quantity
              }));
            setCart(formattedCart);
          }
        }

        setTimeout(() => {
          blockSave.current = false;
          setIsLoaded(true);
        }, 0);

      } catch (err) { 
        console.error("Cart Sync error:", err); 
        blockSave.current = false;
        setIsLoaded(true);
      }
    };

    fetchUserData();
  }, [user?._id, token]);

  // 2. AUTO-SAVE TO DATABASE ON CHANGE
  useEffect(() => {
    if (blockSave.current || !user?._id || !token || !isLoaded) return;

    const syncCartWithDB = async () => {
      setSaveStatus('saving');
      
      const dbItems = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      try {
        const res = await fetch(`${getBaseUrl()}/api/users/cart/update`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ cart: dbItems })
        });

        if (res.ok) {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
          // If we get a 404 or 500, log the actual status to help debugging
          console.error(`Server error: ${res.status}`);
          setSaveStatus('idle');
        }
      } catch (err) {
        console.error("Failed to auto-save cart:", err);
        setSaveStatus('idle');
      }
    };

    const timeoutId = setTimeout(syncCartWithDB, 800);
    return () => clearTimeout(timeoutId);

  }, [cart, user?._id, token, isLoaded]);

  // --- ACTIONS ---

  const addToCart = (product) => {
    if (!user) return alert("Please Login First!");
    
    // Unblock saving immediately on manual action
    blockSave.current = false;

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

  const removeFromCart = (productId) => {
    blockSave.current = false; // Unblock to allow deletion to sync
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    blockSave.current = false; // Unblock to allow quantity change to sync
    setCart(prev => prev.map(item => 
      item._id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems: cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      getCartTotal,
      setCart,
      saveStatus 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);