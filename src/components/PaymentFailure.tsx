import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface PaymentFailureProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export const PaymentFailure: React.FC<PaymentFailureProps> = ({
  error,
  onRetry,
  onBack
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto card p-8 animate-slide-in-glow"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm animate-neon-pulse">SPIT</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gradient mb-2">SPIT ALLIED DIVISION</h1>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow"
        >
          <XCircle className="w-12 h-12 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-primary mb-2">Payment Failed</h2>
        <p className="text-secondary">We couldn't process your payment</p>
      </div>

      <div className="bg-glass border border-error/30 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-error mb-2">Error Details</h3>
        <p className="text-error/80">{error}</p>
      </div>

      <div className="bg-glass rounded-lg p-6 mb-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-primary mb-3">Common Solutions</h3>
        <ul className="space-y-2 text-secondary">
          <li>• Check your internet connection</li>
          <li>• Verify your payment details</li>
          <li>• Ensure sufficient balance in your account</li>
          <li>• Try using a different payment method</li>
          <li>• Contact your bank if the issue persists</li>
        </ul>
      </div>

      <div className="bg-glass p-4 rounded-lg mb-6 text-center border border-primary/20">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md animate-shimmer">
            Easebuzz
          </div>
          <span className="text-sm text-secondary">Payment Gateway</span>
        </div>
        <p className="text-xs text-tertiary">
          For technical support, contact support@easebuzz.in
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md"
        >
          <ArrowLeft size={20} />
          <span>Back to Form</span>
        </motion.button>
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 btn-primary"
        >
          <RefreshCw size={20} />
          <span>Retry Payment</span>
        </motion.button>
      </div>
    </motion.div>
  );
};