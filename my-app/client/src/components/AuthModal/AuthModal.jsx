import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PromoImagePanel from './PromoImagePanel';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, authModalView } = useAuth();

  return (
    <AnimatePresence>
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            className="absolute inset-0"
            style={{ background: 'rgba(5, 15, 30, 0.85)', backdropFilter: 'blur(8px)' }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[620px]"
            style={{
              borderRadius: '24px',
              boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
              maxHeight: '92vh',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* Left Panel - Hidden on Mobile */}
            <div className="hidden md:block md:w-[44%] shrink-0">
              <PromoImagePanel />
            </div>

            {/* Right Panel - The Form */}
            <div
              className="w-full md:w-[56%] flex-1 overflow-y-auto"
              style={{ background: '#ffffff' }}
            >
              <div className="flex min-h-full flex-col justify-center px-8 py-10 lg:px-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authModalView}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    {authModalView === 'login' && <LoginForm />}
                    {authModalView === 'signup' && <SignupForm />}
                    {authModalView === 'forgot-password' && <ForgotPasswordForm />}
                  </motion.div>
                </AnimatePresence>

                {/* Footer */}
                <div className="mt-8 text-center" style={{ fontSize: '11px', color: '#94a3b8' }}>
                  By continuing, you agree to MediQuick's{' '}
                  <a href="#" style={{ fontWeight: 600, color: '#00a2a4' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ fontWeight: 600, color: '#00a2a4' }}>Privacy Policy</a>.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
