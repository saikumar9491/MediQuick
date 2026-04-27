import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '../utils/apiConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved

  const blockSave = useRef(true);

  // --- HUB SYNC: Fetch Cart on Login ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id || !token) {
        setCart([]);
        setIsLoaded(false);
        blockSave.current = true;
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get('content-type');

        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();

          if (data?.cart) {
            // Reconstruct cart items with product details from the populated productId
            const formattedCart = data.cart
              .filter((item) => item.productId)
              .map((item) => ({
                ...item.productId,
                quantity: item.quantity,
              }));

            setCart(formattedCart);
          } else {
            setCart([]);
          }
        } else {
          setCart([]);
        }
      } catch (err) {
        console.error('Cart Sync error:', err);
        setCart([]);
      } finally {
        // Allow saving once the initial hub data is loaded
        // Using a micro-task delay to ensure state updates finish
        setTimeout(() => {
          blockSave.current = false;
          setIsLoaded(true);
        }, 0);
      }
    };

    fetchUserData();
  }, [user?._id, token]);

  // --- AUTO-SAVE: Sync Local State to MongoDB ---
  useEffect(() => {
    // blockSave prevents overwriting DB with an empty array during initial load
    if (blockSave.current || !user?._id || !token || !isLoaded) return;

    const syncCartWithDB = async () => {
      setSaveStatus('saving');

      const dbItems = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      try {
        const res = await fetch(`${API_BASE}/api/users/cart/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: dbItems }),
        });

        if (res.ok) {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
          console.error(`Hub Sync Error: ${res.status}`);
          setSaveStatus('idle');
        }
      } catch (err) {
        console.error('Failed to auto-save cart:', err);
        setSaveStatus('idle');
      }
    };

    // Debounce: Wait 800ms after the last change before hitting the API
    const timeoutId = setTimeout(syncCartWithDB, 800);
    return () => clearTimeout(timeoutId);
  }, [cart, user?._id, token, isLoaded]);

  // --- ACTIONS ---

  const addToCart = (product) => {
    if (!user) return; // Note: MedicineDetails should handle the alert/redirect
    blockSave.current = false;

    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    blockSave.current = false;
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    blockSave.current = false;

    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  /**
   * PROTOCOL: CLEAR HUB INVENTORY
   * Used after successful checkout. 
   * blockSave.current = false ensures the empty array is pushed to the DB.
   */
  const clearCart = () => {
    blockSave.current = false; 
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        setCart,
        saveStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);