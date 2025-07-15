import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { PaymentForm } from '../types/payment';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentData: PaymentForm;
  loading: boolean;
  paymentMethod?: 'checkout' | 'easy_collect';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  paymentData,
  loading,
  paymentMethod = 'easy_collect'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">SPIT</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Confirm Payment</h2>
              <p className="text-sm text-gray-500">Please confirm your information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Name:</span>
            <span className="font-semibold text-gray-800">{paymentData.fullName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold text-gray-800">{paymentData.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Phone:</span>
            <span className="font-semibold text-gray-800">{paymentData.phone}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Course:</span>
            <span className="font-semibold text-gray-800">{paymentData.courseName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">College:</span>
            <span className="font-semibold text-gray-800">{paymentData.collegeName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-xl text-green-600">₹ {paymentData.amount}.0</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
              Easebuzz
            </div>
            <span className="text-sm text-gray-600">
              {paymentMethod === 'easy_collect' ? 'Easy Collect Payment' : 'Secure Payment Gateway'}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center">
            For any queries, please contact us at support@easebuzz.in
          </p>
          {paymentMethod === 'easy_collect' && (
            <p className="text-xs text-gray-500 text-center mt-1">
              A payment link will be generated for secure payment
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <motion.button
            onClick={onConfirm}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : paymentMethod === 'easy_collect' ? 'Generate Link' : 'Pay'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};