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

// --- THEME LOGIC START ---
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
// --- THEME LOGIC END ---

function App() {
  // --- THEME STATE ---
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

    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  // --- END THEME STATE ---

  // --- Payment state and logic ---
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
    // Load existing payment record if any
    const existingRecord = paymentService.getPaymentRecord();
    if (existingRecord) {
      setPaymentRecord(existingRecord);
      setCurrentState('success');
    }
  }, []);

  const handleFormSubmit = async (formData: PaymentFormType) => {
    setPaymentData(formData);
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentData) return;

    setLoading(true);
    setShowConfirmation(false);
    setCurrentState('processing');

    try {
      // Store payment data for later use
      localStorage.setItem('currentPayment', JSON.stringify(paymentData));

      if (paymentMethod === 'easy_collect') {
        // Generate Easy Collect payment link
        const order = await paymentService.createEasyCollectLink(paymentData);
        setPaymentLink(order.paymentLink || '');
        setShowPaymentLink(true);
        setCurrentState('payment_link');
        
        toast.success('Payment link generated successfully!');
        
        // Auto-open the payment link
        if (order.paymentLink) {
          openEasyCollectLink(order.paymentLink);
        }
      } else {
        // Traditional checkout flow
        const scriptLoaded = await loadEasebuzzScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load payment gateway');
        }

        const order = await paymentService.createOrder(paymentData);
        
        openEasebuzzCheckout(
          order.orderId,
          order.amount,
          paymentData,
          order.accessKey || '',
          handlePaymentSuccess,
          handlePaymentFailure
        );
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setCurrentState('failure');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: EasebuzzResponse) => {
    try {
      const verification = {
        easepayid: response.easepayid,
        txnid: response.txnid,
        amount: response.amount,
        status: response.status,
        hash: response.hash
      };

      const record = await paymentService.verifyPayment(verification);
      setPaymentRecord(record);
      setCurrentState('success');
      setShowPaymentLink(false);
      
      toast.success('Payment completed successfully!');
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Payment verification failed');
      setCurrentState('failure');
      toast.error('Payment verification failed');
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
    // Clear all payment data and reset to form
    paymentService.clearPaymentData();
    setPaymentData(null);
    setPaymentRecord(null);
    setPaymentLink('');
    setError('');
    setShowConfirmation(false);
    setShowPaymentLink(false);
    setCurrentState('form');
    toast.success('Ready for new payment');
  };

  const handleRetryPayment = () => {
    setError('');
    setCurrentState('form');
  };

  const handleBackToForm = () => {
    setError('');
    setShowConfirmation(false);
    setShowPaymentLink(false);
    setCurrentState('form');
  };

  const handleClosePaymentLink = () => {
    setShowPaymentLink(false);
    // Simulate successful payment for demo purposes
    setTimeout(() => {
      const mockResponse: EasebuzzResponse = {
        easepayid: `EASEBUZZ_${Date.now()}`,
        txnid: `TXN_${Date.now()}`,
        amount: paymentData?.amount.toString() || '0',
        status: 'success',
        hash: 'mock_hash',
        payment_source: 'UPI',
        PG_TYPE: 'UPI',
        bank_ref_num: `REF_${Date.now()}`,
        bankcode: 'UPI',
        error: '',
        error_Message: ''
      };
      handlePaymentSuccess(mockResponse);
    }, 2000);
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

        {/* Confirmation Modal */}
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

        {/* Payment Link Modal */}
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