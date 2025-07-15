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
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful</h2>
        <p className="text-gray-600">Your payment has completed successfully</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Description</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Name</span>
            <span className="font-semibold text-gray-800">{paymentRecord.fullName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phone</span>
            <span className="font-semibold text-gray-800">{paymentRecord.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Mode</span>
            <span className="font-semibold text-gray-800">UPI</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="font-bold text-xl text-green-600">{paymentRecord.amount}.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              success
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date</span>
            <span className="font-semibold text-gray-800">{formatDate(paymentRecord.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
            Easebuzz
          </div>
          <span className="text-sm text-gray-600">Payment Gateway</span>
        </div>
        <p className="text-xs text-gray-500">
          Transaction processed securely through Easebuzz
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          onClick={onDownloadReceipt}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          <span>Download Receipt</span>
        </motion.button>
        <motion.button
          onClick={onNewPayment}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={20} />
          <span>New Payment</span>
        </motion.button>
      </div>
    </motion.div>
  );
};