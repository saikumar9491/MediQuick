import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext' 
import { GoogleOAuthProvider } from '@react-oauth/google';

// 🚀 YOUR HUB'S UNIQUE IDENTITY
const CLIENT_ID = "192919291714-mgdn6nq4f8q5rj2m34243k4qffulr7vv.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🛡️ This Provider allows the entire Hub to use Google Social Login */}
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)