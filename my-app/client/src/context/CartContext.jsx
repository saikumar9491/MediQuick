import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '../utils/apiConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token, setShowAuthModal, setAuthModalView } = useAuth();
  
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

  // Helper for immediate save to backend DB
  const saveCartToBackend = async (newCart) => {
    if (!user || !token) return;
    setSaveStatus('saving');
    const dbPayload = newCart.map(item => ({
      productId: item._id || item.productId,
      quantity: item.quantity
    }));

    try {
      await Promise.all([
        fetch(`${API_BASE}/api/users/cart/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ cart: dbPayload }),
        }),
        fetch(`${API_BASE}/api/cart/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ items: dbPayload }),
        })
      ]);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err) {
      console.error('Immediate cart save failed:', err);
    }
  };

  // 🛰️ SYNC WITH BACKEND ON MOUNT / AUTH CHANGE
  useEffect(() => {
    const syncWithBackend = async () => {
      if (!user || !token) {
        setIsLoaded(true);
        blockSave.current = false;
        return;
      }

      try {
        const cartRes = await fetch(`${API_BASE}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cartRes.ok) {
          const data = await cartRes.json();
          if (Array.isArray(data?.items)) {
            const backendCart = data.items.map(item => ({
              _id: item.productId,
              ...item,
            }));
            setCart(backendCart);
            localStorage.setItem('mediQuickCart', JSON.stringify(backendCart));
          }
        }
      } catch (err) {
        console.error('Cart Backend Sync Failed:', err);
      } finally {
        setIsLoaded(true);
        setTimeout(() => { blockSave.current = false; }, 500);
      }
    };

    syncWithBackend();
  }, [user?._id, token]);

  // 💾 AUTO-SAVE DEBOUNCE FALLBACK
  useEffect(() => {
    if (blockSave.current || !user || !token || !isLoaded) return;
    const debounce = setTimeout(() => {
      saveCartToBackend(cart);
    }, 1000);
    return () => clearTimeout(debounce);
  }, [cart, user?._id, token, isLoaded]);

  // --- ACTIONS ---
  const addToCart = (product) => {
    if (!user) {
      setAuthModalView('login');
      setShowAuthModal(true);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return false;
    }
    blockSave.current = false;
    
    let nextCart = [];
    const pId = product._id || product.productId;
    const exists = cart.find(item => (item._id || item.productId) === pId);
    if (exists) {
      nextCart = cart.map(item => 
        (item._id || item.productId) === pId 
          ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
          : item
      );
    } else {
      nextCart = [...cart, { ...product, _id: pId, quantity: product.quantity || 1 }];
    }
    
    setCart(nextCart);
    localStorage.setItem('mediQuickCart', JSON.stringify(nextCart));
    saveCartToBackend(nextCart);
    return true;
  };

  const addToCartMultiple = (itemsList) => {
    if (!user) {
      setAuthModalView('login');
      setShowAuthModal(true);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return false;
    }
    if (!Array.isArray(itemsList) || itemsList.length === 0) return false;
    blockSave.current = false;

    let updated = [...cart];
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

    setCart(updated);
    localStorage.setItem('mediQuickCart', JSON.stringify(updated));
    saveCartToBackend(updated);
    return true;
  };

  const removeFromCart = (productId) => {
    blockSave.current = false;
    const nextCart = cart.filter(item => (item._id || item.productId) !== productId);
    setCart(nextCart);
    localStorage.setItem('mediQuickCart', JSON.stringify(nextCart));
    saveCartToBackend(nextCart);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    blockSave.current = false;
    const nextCart = cart.map(item => 
      (item._id || item.productId) === productId ? { ...item, quantity: newQty } : item
    );
    setCart(nextCart);
    localStorage.setItem('mediQuickCart', JSON.stringify(nextCart));
    saveCartToBackend(nextCart);
  };

  const clearCart = () => {
    blockSave.current = false;
    setCart([]);
    localStorage.setItem('mediQuickCart', JSON.stringify([]));
    saveCartToBackend([]);
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
