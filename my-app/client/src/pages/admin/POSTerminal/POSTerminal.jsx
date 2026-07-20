import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../../utils/apiConfig';
import { ProductSearchPanel } from './components/ProductSearchPanel';
import { CartPanel } from './components/CartPanel';
import { CheckoutSection } from './components/CheckoutSection';
import { ReceiptPreview } from './components/ReceiptPreview';
import toast from 'react-hot-toast';

const POSTerminal = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState({ name: 'Walk-in Customer', phone: '', userId: null });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discount, setDiscount] = useState(0);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to add item to cart
  const addToCart = (product) => {
    // Check if Rx confirmed
    if (product.needsRx) {
      const confirmed = window.confirm(`"${product.name}" requires a prescription. Has the customer provided a valid prescription?`);
      if (!confirmed) {
        toast.error('Cannot add Rx item without verification.');
        return;
      }
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.countInStock) {
          toast.error(`Only ${product.countInStock} available for ${product.name}`);
          return prev;
        }
        return prev.map(item => 
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        if (product.countInStock < 1) {
          toast.error(`${product.name} is out of stock`);
          return prev;
        }
        return [...prev, {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          brand: product.brand,
          countInStock: product.countInStock
        }];
      }
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      setCartItems(prev => prev.filter(i => i.productId !== productId));
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId) {
        if (newQty > item.countInStock) {
          toast.error(`Only ${item.countInStock} available.`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    if (cartItems.length > 0 && window.confirm("Are you sure you want to clear the current sale?")) {
      setCartItems([]);
      setCustomer({ name: 'Walk-in Customer', phone: '', userId: null });
      setPaymentMethod('');
      setDiscount(0);
    }
  };

  const handleCompleteSale = async () => {
    if (cartItems.length === 0) return toast.error('Cart is empty');
    if (!paymentMethod) return toast.error('Select a payment method');

    setIsProcessing(true);
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalAmount = Math.max(0, subtotal - discount);

    const orderData = {
      orderType: 'pos',
      customerName: customer.name,
      customerPhone: customer.phone,
      userId: customer.userId || undefined,
      items: cartItems,
      totalAmount,
      paymentMethod,
      shippingAddress: undefined // POS orders don't need shipping
    };

    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.post(`${API_BASE}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Sale completed successfully!');
      setCompletedOrder(res.data);
      // Don't clear cart yet, let ReceiptPreview handle it on close
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing sale');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseReceipt = () => {
    setCompletedOrder(null);
    setCartItems([]);
    setCustomer({ name: 'Walk-in Customer', phone: '', userId: null });
    setPaymentMethod('');
    setDiscount(0);
  };

  if (completedOrder) {
    return <ReceiptPreview order={completedOrder} onClose={handleCloseReceipt} />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-100px)] animate-in fade-in duration-500">
      {/* Left Column: Search & Selection (60%) */}
      <div className="w-full md:w-[60%] flex flex-col gap-6">
        <ProductSearchPanel onAdd={addToCart} />
      </div>

      {/* Right Column: Cart & Checkout (40%) */}
      <div className="w-full md:w-[40%] flex flex-col gap-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex-1">
        <CartPanel 
          cartItems={cartItems} 
          updateQuantity={updateQuantity} 
          removeFromCart={removeFromCart} 
        />
        <CheckoutSection 
          cartItems={cartItems}
          customer={customer}
          setCustomer={setCustomer}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          discount={discount}
          setDiscount={setDiscount}
          onComplete={handleCompleteSale}
          onClear={clearCart}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default POSTerminal;
