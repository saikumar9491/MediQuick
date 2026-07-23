import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '../utils/apiConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  
  // 🚀 INITIALIZE FROM LOCAL STORAGE FOR INSTANT UI
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('mediQuickCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const blockSave = useRef(true);

  // 📦 PERSIST TO LOCAL STORAGE ON EVERY CHANGE
  useEffect(() => {
    localStorage.setItem('mediQuickCart', JSON.stringify(cart));
  }, [cart]);

  // 🛰️ SYNC WITH BACKEND ON MOUNT / AUTH CHANGE
  useEffect(() => {
    const syncWithBackend = async () => {
      if (!user || !token) {
        setIsLoaded(true);
        blockSave.current = false;
        return;
      }

      try {
        // Primary: load from Cart collection (live stock data)
        const cartRes = await fetch(`${API_BASE}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cartRes.ok) {
          const data = await cartRes.json();
          if (data?.items?.length > 0 || cart.length === 0) {
            const backendCart = data.items.map(item => ({
              _id: item.productId,
              ...item,
            }));
            setCart(backendCart);
          }
        } else {
          // Fallback: load from User.cart (legacy)
          const profileRes = await fetch(`${API_BASE}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.ok) {
            const data = await profileRes.json();
            if (data?.cart) {
              const backendCart = data.cart
                .filter(item => item.productId)
                .map(item => ({ ...item.productId, quantity: item.quantity }));
              if (backendCart.length > 0 || cart.length === 0) setCart(backendCart);
            }
          }
        }
      } catch (err) {
        console.error('Cart Backend Sync Failed:', err);
      } finally {
        setIsLoaded(true);
        setTimeout(() => { blockSave.current = false; }, 1000);
      }
    };

    syncWithBackend();
  }, [user?._id, token]);

  // 💾 AUTO-SAVE TO BACKEND
  useEffect(() => {
    // PREVENT: Saving while loading, or if no user, or if explicitly blocked
    if (blockSave.current || !user || !token || !isLoaded) return;

    const autoSave = async () => {
      setSaveStatus('saving');
      const dbPayload = cart.map(item => ({
        productId: item._id || item.productId,
        quantity: item.quantity
      }));

      try {
        // Sync to User.cart (for profile/order endpoints)
        await fetch(`${API_BASE}/api/users/cart/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ cart: dbPayload }),
        });

        // Sync to Cart collection (for Abandoned Cart tracking)
        await fetch(`${API_BASE}/api/cart/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ items: dbPayload }),
        });

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    };

    const debounce = setTimeout(autoSave, 1000);
    return () => clearTimeout(debounce);
  }, [cart, user?._id, token, isLoaded]);

  // --- ACTIONS ---
  const addToCart = (product) => {
    blockSave.current = false; // Enable saving for this user action
    setCart(prev => {
      const exists = prev.find(item => (item._id || item.productId) === (product._id || product.productId));
      if (exists) {
        return prev.map(item => 
          (item._id || item.productId) === (product._id || product.productId) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, _id: product._id || product.productId, quantity: product.quantity || 1 }];
    });
  };

  const addToCartMultiple = (itemsList) => {
    if (!Array.isArray(itemsList) || itemsList.length === 0) return;
    blockSave.current = false;
    setCart(prev => {
      let updated = [...prev];
      itemsList.forEach(product => {
        const pId = product.productId?._id || product.productId || product._id;
        if (!pId) return;
        const existsIndex = updated.findIndex(item => (item._id || item.productId) === pId);
        const addQty = product.quantity || 1;
        if (existsIndex > -1) {
          updated[existsIndex] = {
            ...updated[existsIndex],
            quantity: updated[existsIndex].quantity + addQty
          };
        } else {
          updated.push({
            _id: pId,
            productId: pId,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            needsRx: product.needsRx || false,
            quantity: addQty
          });
        }
      });
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    blockSave.current = false;
    setCart(prev => prev.filter(item => (item._id || item.productId) !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    blockSave.current = false;
    setCart(prev => prev.map(item => 
      (item._id || item.productId) === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const clearCart = () => {
    blockSave.current = false;
    setCart([]);
  };

  const getCartTotal = () => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems: cart, 
      setCartItems: setCart,
      addToCart, 
      addToCartMultiple,
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal, 
      saveStatus 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
