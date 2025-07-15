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

function App() {
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

      if (paymentMethod === 'easy_collect') {
        // Method 1: Create Easy Collect Payment Link
        setCurrentState('processing');
        const order = await paymentService.createEasyCollectLink(paymentData);
        
        if (order.paymentLink) {
          setPaymentLink(order.paymentLink);
          setShowPaymentLink(true);
          setCurrentState('payment_link');
          
          // Auto-open the payment link
          setTimeout(() => {
            openEasyCollectLink(order.paymentLink!);
          }, 1000);
        }
      } else {
        // Method 2: Traditional Checkout Modal
        setCurrentState('processing');
        
        // Load Easebuzz script
        const isEasebuzzLoaded = await loadEasebuzzScript();
        if (!isEasebuzzLoaded) {
          throw new Error('Failed to load Easebuzz SDK');
        }

        // Create order
        const order = await paymentService.createOrder(paymentData);
        
        // Open Easebuzz checkout
        if (order.easebuzzKey && order.accessKey) {
          openEasebuzzCheckout(
            order.orderId,
            order.amount,
            paymentData,
            order.accessKey,
            handlePaymentSuccess,
            handlePaymentFailure
          );
        }
      }
    } catch (err: any) {
      handlePaymentFailure(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: EasebuzzResponse) => {
    setLoading(true);
    
    try {
      // Verify payment
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
      toast.success('Payment successful!');
    } catch (err: any) {
      handlePaymentFailure(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = (error: any) => {
    setError(error.message || 'Payment failed. Please try again.');
    setCurrentState('failure');
    toast.error('Payment failed!');
    setLoading(false);
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
    setShowPaymentLink(false);
    setCurrentState('form');
    setError('');
  };

  const handleRetryPayment = () => {
    if (paymentData) {
      setCurrentState('confirmation');
      setShowConfirmation(true);
      setError('');
    } else {
      setCurrentState('form');
    }
  };

  const handleBackToForm = () => {
    setCurrentState('form');
    setShowPaymentLink(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <AnimatePresence mode="wait">
        {currentState === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
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

        {currentState === 'payment_link' && (
          <motion.div
            key="payment_link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SPIT</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Link Generated</h2>
            <p className="text-gray-600 mb-4">Your secure payment link is ready</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                The payment window should open automatically. If not, click the link in the modal.
              </p>
            </div>
            <button
              onClick={handleNewPayment}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Generate New Link
            </button>
          </motion.div>
        )}

        {currentState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SPIT</span>
              </div>
            </div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we process your payment...</p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                Easebuzz
              </div>
              <span className="text-sm text-gray-600">Secure Payment Gateway</span>
            </div>
          </motion.div>
        )}

        {currentState === 'success' && paymentRecord && (
          <motion.div
            key="success"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPayment}
        paymentData={paymentData || {} as PaymentFormType}
        loading={loading}
        paymentMethod={paymentMethod}
      />

      <PaymentLinkModal
        isOpen={showPaymentLink}
        onClose={() => setShowPaymentLink(false)}
        paymentLink={paymentLink}
        amount={paymentData?.amount || 0}
        studentName={paymentData?.fullName || ''}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;