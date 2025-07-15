import { PaymentForm, RazorpayResponse } from '../types/payment';

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = (
  orderId: string,
  amount: number,
  paymentData: PaymentForm,
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: (error: any) => void
): void => {
  const options = {
    key: 'rzp_test_1234567890', // Replace with your Razorpay key
    amount: amount,
    currency: 'INR',
    name: 'SPIT Allied Division',
    description: `Fee for ${paymentData.courseName}`,
    order_id: orderId,
    image: '/assets/spit-logo.png',
    prefill: {
      name: paymentData.fullName,
      email: paymentData.email,
      contact: paymentData.phone,
    },
    theme: {
      color: '#2563eb',
    },
    handler: (response: RazorpayResponse) => {
      onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        onFailure(new Error('Payment cancelled by user'));
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};