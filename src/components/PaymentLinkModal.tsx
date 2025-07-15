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
              <h2 className="text-xl font-bold text-gray-800">Payment Link Generated</h2>
              <p className="text-sm text-gray-500">Ready for secure payment</p>
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Payment Link Created</span>
            </div>
            <p className="text-sm text-green-700">
              Your secure payment link has been generated successfully.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Student:</span>
              <span className="font-semibold text-gray-800">{studentName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-xl text-green-600">₹ {amount}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Link:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={paymentLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Copy link"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
              Easebuzz
            </div>
            <span className="text-sm text-gray-600">Easy Collect Payment</span>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Secure payment processing with multiple payment options
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <motion.button
            onClick={handleOpenLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink size={16} />
            <span>Open Payment</span>
          </motion.button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>The payment link is valid for 24 hours</p>
          <p>You can share this link via SMS, email, or WhatsApp</p>
        </div>
      </motion.div>
    </div>
  );
};