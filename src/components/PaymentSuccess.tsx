import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, RefreshCw } from 'lucide-react';
import { PaymentRecord } from '../types/payment';

interface PaymentSuccessProps {
  paymentRecord: PaymentRecord;
  onDownloadReceipt: () => void;
  onNewPayment: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  paymentRecord,
  onDownloadReceipt,
  onNewPayment
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-primary mb-2">Payment Successful</h2>
        <p className="text-secondary">Your payment has completed successfully</p>
      </div>

      <div className="bg-glass rounded-lg p-6 mb-6 border border-primary/20">
        <h3 className="text-xl font-semibold text-primary mb-4">Payment Description</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary">Name</span>
            <span className="font-semibold text-primary">{paymentRecord.fullName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Phone</span>
            <span className="font-semibold text-primary">{paymentRecord.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Payment Mode</span>
            <span className="font-semibold text-primary">UPI</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Amount</span>
            <span className="font-bold text-xl success-indicator">{paymentRecord.amount}.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm">
              success
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Date</span>
            <span className="font-semibold text-primary">{formatDate(paymentRecord.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="bg-glass p-4 rounded-lg mb-6 text-center border border-primary/20">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md animate-shimmer">
            Easebuzz
          </div>
          <span className="text-sm text-secondary">Payment Gateway</span>
        </div>
        <p className="text-xs text-tertiary">
          Transaction processed securely through Easebuzz
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          onClick={onDownloadReceipt}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 btn-primary"
        >
          <Download size={20} />
          <span>Download Receipt</span>
        </motion.button>
        <motion.button
          onClick={onNewPayment}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md"
        >
          <RefreshCw size={20} />
          <span>New Payment</span>
        </motion.button>
      </div>
    </motion.div>
  );
};