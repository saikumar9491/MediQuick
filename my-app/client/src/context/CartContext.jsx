import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart from localStorage to prevent data loss on refresh
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showNotification = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const addToCart = (product) => {
    setCart((prevItems) => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        showNotification(`${product.name} quantity updated!`);
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      showNotification(`${product.name} added to cart!`);
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevItems) => prevItems.map(item => item._id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (id) => {
    setCart((prevItems) => prevItems.filter(item => item._id !== id));
    showNotification("Item removed from cart", "error");
  };

  // CRITICAL FIX: Function to wipe cart after successful order
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => cart.reduce((t, i) => t + (i.price * (i.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems: cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, // Exported for Checkout.jsx
      getCartTotal,
      showNotification 
    }}>
      {children}
      
      {/* GLOBAL TOAST NOTIFICATION UI */}
      {toast.show && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 rounded-sm shadow-2xl font-black uppercase italic text-xs tracking-widest animate-bounce border-l-4 ${
          toast.type === 'success' ? 'bg-white text-green-600 border-green-600' : 'bg-white text-red-600 border-red-600'
        }`}>
          {toast.type === 'success' ? '✔ ' : '✖ '} {toast.message}
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);