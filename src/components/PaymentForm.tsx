import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaymentForm as PaymentFormType } from '../types/payment';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormType) => void;
  loading: boolean;
  paymentMethod?: 'checkout' | 'easy_collect';
  onPaymentMethodChange?: (method: 'checkout' | 'easy_collect') => void;
}

const courses = [
  'Linux Essentials',
  'Python Programming',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Computing',
  'Mobile App Development'
];

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onSubmit, 
  loading, 
  paymentMethod = 'easy_collect',
  onPaymentMethodChange 
}) => {
  const [formData, setFormData] = useState<PaymentFormType>({
    fullName: '',
    email: '',
    phone: '',
    courseName: '',
    collegeName: '',
    amount: 0
  });

  const [errors, setErrors] = useState<Partial<PaymentFormType>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormType> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.courseName) {
      newErrors.courseName = 'Course selection is required';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof PaymentFormType, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SPIT ALLIED DIVISION</h1>
        <p className="text-gray-600">Fee collection for certificate courses</p>
        <div className="flex items-center justify-center mt-4 space-x-2">
          <span className="text-sm text-gray-500">Powered by</span>
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
            Easebuzz
          </div>
        </div>
      </div>

      {onPaymentMethodChange && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="easy_collect"
                checked={paymentMethod === 'easy_collect'}
                onChange={(e) => onPaymentMethodChange(e.target.value as 'easy_collect')}
                className="mr-2"
              />
              <span className="text-sm">Easy Collect Link</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="checkout"
                checked={paymentMethod === 'checkout'}
                onChange={(e) => onPaymentMethodChange(e.target.value as 'checkout')}
                className="mr-2"
              />
              <span className="text-sm">Checkout Modal</span>
            </label>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => handleChange('amount', Number(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
              min="1"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name *
          </label>
          <select
            value={formData.courseName}
            onChange={(e) => handleChange('courseName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.courseName ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          {errors.courseName && (
            <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            College Name *
          </label>
          <input
            type="text"
            value={formData.collegeName}
            onChange={(e) => handleChange('collegeName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.collegeName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your college name"
          />
          {errors.collegeName && (
            <p className="text-red-500 text-sm mt-1">{errors.collegeName}</p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : paymentMethod === 'easy_collect' ? 'Generate Payment Link' : 'Proceed to Pay'}
        </motion.button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Details of courses are as below:</p>
        <p className="mt-2">You agree to share information entered on this page with SPIT ALLIED DIVISION (owner of this page) and Easebuzz, adhering to applicable laws.</p>
      </div>
    </motion.div>
  );
};