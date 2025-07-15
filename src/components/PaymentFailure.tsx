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
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">SPIT</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">SPIT ALLIED DIVISION</h1>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <XCircle className="w-12 h-12 text-red-600" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600">We couldn't process your payment</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Details</h3>
        <p className="text-red-700">{error}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Solutions</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Check your internet connection</li>
          <li>• Verify your payment details</li>
          <li>• Ensure sufficient balance in your account</li>
          <li>• Try using a different payment method</li>
          <li>• Contact your bank if the issue persists</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
            Easebuzz
          </div>
          <span className="text-sm text-gray-600">Payment Gateway</span>
        </div>
        <p className="text-xs text-gray-500">
          For technical support, contact support@easebuzz.in
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Form</span>
        </motion.button>
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} />
          <span>Retry Payment</span>
        </motion.button>
      </div>
    </motion.div>
  );
};