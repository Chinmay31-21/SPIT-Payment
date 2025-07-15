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
      margin: "1rem",
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

  // --- Payment state and logic (unchanged) ---
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

    try {
      // Store payment data for later use
      localStorage.setItem('currentPayment', JSON.stringify(paymentData));
      // ... (rest of your payment logic)
    } catch (err) {
      setError('Payment failed.');
      setCurrentState('failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Theme toggle button at top right */}
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 999 }}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      <Toaster />
      {/* Your payment app UI below */}
      <AnimatePresence>
        {currentState === 'form' && (
          <PaymentForm
            onSubmit={handleFormSubmit}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        )}
        {showConfirmation && paymentData && (
          <ConfirmationModal
            isOpen={showConfirmation}
            paymentData={paymentData}
            onConfirm={handleConfirmPayment}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
        {showPaymentLink && (
          <PaymentLinkModal
            isOpen={showPaymentLink}
            paymentLink={paymentLink}
            onClose={() => setShowPaymentLink(false)}
          />
        )}
        {currentState === 'success' && paymentRecord && (
          <PaymentSuccess paymentRecord={paymentRecord} />
        )}
        {currentState === 'failure' && (
          <PaymentFailure error={error} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
