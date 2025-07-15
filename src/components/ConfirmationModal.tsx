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
  paymentMethod: 'checkout' | 'easy_collect';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  paymentData,
  loading,
  paymentMethod
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="modal-content max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-white font-bold text-sm">SPIT</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Confirm Payment</h2>
              <p className="text-sm text-tertiary">Please confirm your information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-tertiary hover:text-primary transition-colors p-1 rounded-lg hover:bg-glass"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-secondary">Name:</span>
            <span className="font-semibold text-primary">{paymentData.fullName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-secondary">Email:</span>
            <span className="font-semibold text-primary">{paymentData.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-secondary">Phone:</span>
            <span className="font-semibold text-primary">{paymentData.phone}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-secondary">Course:</span>
            <span className="font-semibold text-primary">{paymentData.courseName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-secondary">College:</span>
            <span className="font-semibold text-primary">{paymentData.collegeName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-secondary">Total Amount:</span>
            <span className="font-bold text-xl success-indicator">₹ {paymentData.amount}.0</span>
          </div>
        </div>

        <div className="bg-glass p-4 rounded-lg mb-6 border border-primary/20">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md animate-shimmer">
              Easebuzz
            </div>
            <span className="text-sm text-secondary">
              {paymentMethod === 'easy_collect' ? 'Easy Collect Payment' : 'Secure Payment Gateway'}
            </span>
          </div>
          <p className="text-xs text-tertiary text-center">
            For any queries, please contact us at support@easebuzz.in
          </p>
          {paymentMethod === 'easy_collect' && (
            <p className="text-xs text-tertiary text-center mt-1">
              A payment link will be generated for secure payment
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-primary/30 rounded-lg text-secondary hover:bg-glass transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <motion.button
            onClick={onConfirm}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Processing...' : paymentMethod === 'easy_collect' ? 'Generate Link' : 'Pay'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};