import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentLink: string;
  amount: number;
  studentName: string;
}

export const PaymentLinkModal: React.FC<PaymentLinkModalProps> = ({
  isOpen,
  onClose,
  paymentLink,
  amount,
  studentName
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      toast.success('Payment link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenLink = () => {
    window.open(paymentLink, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

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
              <h2 className="text-xl font-bold text-primary">Payment Link Generated</h2>
              <p className="text-sm text-tertiary">Ready for secure payment</p>
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
          <div className="bg-glass border border-success/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 success-indicator" />
              <span className="font-semibold success-indicator">Payment Link Created</span>
            </div>
            <p className="text-sm text-secondary">
              Your secure payment link has been generated successfully.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-primary/10">
              <span className="text-secondary">Student:</span>
              <span className="font-semibold text-primary">{studentName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-primary/10">
              <span className="text-secondary">Amount:</span>
              <span className="font-bold text-xl success-indicator">₹ {amount}</span>
            </div>
          </div>

          <div className="bg-glass rounded-lg p-4 border border-primary/20">
            <label className="form-label">
              Payment Link:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={paymentLink}
                readOnly
                className="flex-1 form-input text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md"
                title="Copy link"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-glass p-4 rounded-lg mb-6 border border-primary/20">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md animate-shimmer">
              Easebuzz
            </div>
            <span className="text-sm text-secondary">Easy Collect Payment</span>
          </div>
          <p className="text-xs text-tertiary text-center">
            Secure payment processing with multiple payment options
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-primary/30 rounded-lg text-secondary hover:bg-glass transition-all"
          >
            Close
          </button>
          <motion.button
            onClick={handleOpenLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 btn-primary"
          >
            <ExternalLink size={16} />
            <span>Open Payment</span>
          </motion.button>
        </div>

        <div className="mt-4 text-center text-xs text-tertiary">
          <p>The payment link is valid for 24 hours</p>
          <p>You can share this link via SMS, email, or WhatsApp</p>
        </div>
      </motion.div>
    </div>
  );
};