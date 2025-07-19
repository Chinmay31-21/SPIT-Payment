import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { PaymentForm } from './components/PaymentForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PaymentLinkModal } from './components/PaymentLinkModal';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailure } from './components/PaymentFailure';
import { PaymentForm as PaymentFormType, PaymentRecord, EasebuzzResponse } from './types/payment';
import { paymentService } from './services/paymentService';
import { loadEasebuzzScript, openEasebuzzCheckout, openEasyCollectLink } from './utils/easebuzz';
import { generateReceipt } from './utils/receiptGenerator';

type AppState = 'form' | 'confirmation' | 'processing' | 'payment_link' | 'success' | 'failure';

// --- THEME LOGIC (No changes here) ---
const ThemeToggle: React.FC<{ theme: string; toggleTheme: () => void }> = ({
  theme,
  toggleTheme,
}) => (
  <button
    className="theme-toggle"
    aria-label="Toggle theme"
    onClick={toggleTheme}
    style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 999,
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      fontWeight: 600,
      border: "1px solid var(--border-primary)",
      background: theme === "light" ? "var(--bg-primary)" : "var(--bg-tertiary)",
      color: theme === "light" ? "var(--accent-primary)" : "var(--accent-warning)",
      boxShadow: "var(--shadow-md)",
      transition: "all var(--transition-normal)",
    }}
  >
    {theme === "light" ? "🌞" : "🌜"}
  </button>
);

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.classList.add("theme-transition");
    localStorage.setItem("theme", theme);
    const timeout = setTimeout(() => root.classList.remove("theme-transition"), 300);
    return () => clearTimeout(timeout);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // --- Payment state and logic (with updates) ---
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [paymentData, setPaymentData] = useState<PaymentFormType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'checkout' | 'easy_collect'>('easy_collect');

  useEffect(() => {
    // Check for payment status from URL on component mount (for redirects)
    const urlParams = new URLSearchParams(window.location.search);
    const txnid = urlParams.get('txnid');
    const status = urlParams.get('status');

    if (txnid && status) {
        if(status === 'success') {
            const fetchRecord = async () => {
                const record = await paymentService.getPaymentRecord(txnid);
                if (record) {
                    setPaymentRecord(record);
                    setCurrentState('success');
                }
            };
            fetchRecord();
        } else {
            setError("Payment was not successful.");
            setCurrentState('failure');
        }
    }
  }, []);

  const handleFormSubmit = (formData: PaymentFormType) => {
    setPaymentData(formData);
    setShowConfirmation(true);
  };

  // **UPDATED FUNCTION**
  const handleConfirmPayment = async () => {
    if (!paymentData) return;

    setLoading(true);
    setShowConfirmation(false);
    setCurrentState('processing');

    try {
      localStorage.setItem('currentPayment', JSON.stringify(paymentData));

      if (paymentMethod === 'easy_collect') {
        const order = await paymentService.createEasyCollectLink(paymentData);
        setPaymentLink(order.paymentLink || '');
        setShowPaymentLink(true);
        setCurrentState('payment_link');
        toast.success('Payment link generated!');
        if (order.paymentLink) {
          openEasyCollectLink(order.paymentLink);
        }
      } else {
        // Traditional checkout flow now calls YOUR backend first
        const scriptLoaded = await loadEasebuzzScript();
        if (!scriptLoaded) throw new Error('Failed to load payment gateway');

        // 1. Get order details and hash from YOUR backend
        const order = await paymentService.createOrder(paymentData);

        // 2. Open checkout with the details from your backend
        openEasebuzzCheckout(
          order,
          paymentData,
          handlePaymentSuccess,
          handlePaymentFailure
        );
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setCurrentState('failure');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handlePaymentSuccess = async (response: EasebuzzResponse) => {
    try {
      // The backend handles the primary verification via webhook.
      // This is for giving the user immediate feedback.
      toast.success('Payment processing initiated successfully!');
      // We will rely on the backend redirect to show the final success/failure page.
      // For a smoother UX, you could poll your backend for the payment status here.
      const record = await paymentService.getPaymentRecord(response.txnid);
       if (record) {
           setPaymentRecord(record);
           setCurrentState('success');
       }
    } catch (err) {
      console.error('Error after payment success callback:', err);
      setError('Could not confirm payment status.');
      setCurrentState('failure');
      toast.error('Could not confirm payment status.');
    }
  };


  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    setError(error.message || 'Payment failed');
    setCurrentState('failure');
    setShowPaymentLink(false);
    toast.error('Payment failed. Please try again.');
  };

  const handleDownloadReceipt = () => {
    if (paymentRecord) {
      generateReceipt(paymentRecord);
      toast.success('Receipt downloaded successfully!');
    }
  };

  const handleNewPayment = () => {
    paymentService.clearPaymentData();
    setPaymentData(null);
    setPaymentRecord(null);
    setPaymentLink('');
    setError('');
    setShowConfirmation(false);
    setShowPaymentLink(false);
    setCurrentState('form');
    // Clear URL params
    window.history.pushState({}, document.title, "/");
    toast.success('Ready for new payment');
  };

  const handleRetryPayment = () => {
    setError('');
    setCurrentState('form');
    window.history.pushState({}, document.title, "/");
  };

  const handleBackToForm = () => {
    setError('');
    setShowConfirmation(false);
    setShowPaymentLink(false);
    setCurrentState('form');
  };

  const handleClosePaymentLink = () => {
    setShowPaymentLink(false);
    // You might want to poll for payment status here
  };

  return (
    <div className="min-h-screen bg-primary p-4">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-glass)',
            backdropFilter: 'var(--blur-md)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />

      <div className="container mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
        {currentState === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentForm
                onSubmit={handleFormSubmit}
                loading={loading}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
            </motion.div>
          )}

          {currentState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="card p-8 text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-primary mb-2">Processing Payment</h2>
                <p className="text-secondary">Please wait while we process your request...</p>
              </div>
            </motion.div>
          )}

          {currentState === 'success' && paymentRecord && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentSuccess
                paymentRecord={paymentRecord}
                onDownloadReceipt={handleDownloadReceipt}
                onNewPayment={handleNewPayment}
              />
            </motion.div>
          )}

          {currentState === 'failure' && (
            <motion.div
              key="failure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentFailure
                error={error}
                onRetry={handleRetryPayment}
                onBack={handleBackToForm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {showConfirmation && paymentData && (
          <ConfirmationModal
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmPayment}
            paymentData={paymentData}
            loading={loading}
            paymentMethod={paymentMethod}
          />
        )}

        {showPaymentLink && paymentData && (
          <PaymentLinkModal
            isOpen={showPaymentLink}
            onClose={handleClosePaymentLink}
            paymentLink={paymentLink}
            amount={paymentData.amount}
            studentName={paymentData.fullName}
          />
        )}
      </div>
    </div>
  );
}

export default App;