import { PaymentForm, EasebuzzResponse } from '../types/payment';

// Method 1: Open Easy Collect Payment Link
export const openEasyCollectLink = (paymentLink: string): void => {
  // Open payment link in new window/tab
  const paymentWindow = window.open(
    paymentLink,
    'easebuzz_payment',
    'width=800,height=600,scrollbars=yes,resizable=yes'
  );

  // Optional: Monitor the payment window
  const checkClosed = setInterval(() => {
    if (paymentWindow?.closed) {
      clearInterval(checkClosed);
      // Handle window closed - you might want to check payment status
      console.log('Payment window closed');
    }
  }, 1000);
};

// Method 2: Load Easebuzz SDK for traditional checkout
export const loadEasebuzzScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openEasebuzzCheckout = (
  orderId: string,
  amount: number,
  paymentData: PaymentForm,
  accessKey: string,
  onSuccess: (response: EasebuzzResponse) => void,
  onFailure: (error: any) => void
): void => {
  const options = {
    access_key: accessKey, // Access key
    txnid: orderId, // Transaction ID
    amount: amount.toString(), // Amount
    firstname: paymentData.fullName.split(' ')[0],
    email: paymentData.email,
    phone: paymentData.phone,
    productinfo: `Fee for ${paymentData.courseName}`,
    surl: `${window.location.origin}/payment/success`, // Success URL
    furl: `${window.location.origin}/payment/failure`, // Failure URL
    udf1: paymentData.courseName,
    udf2: paymentData.collegeName,
    udf3: '',
    udf4: '',
    udf5: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'India',
    zipcode: '',
    show_payment_mode: 'CC,DC,NB,UPI,WALLET',
    split_payments: 'false',
    payment_category: 'EDUCATION',
    account_no: '',
    ifsc: '',
    theme: '#2563eb'
  };

  const easebuzzCheckout = new window.EasebuzzCheckout(
    'EASEBUZZ_TEST_KEY', // Your merchant key
    'test' // Environment: 'test' or 'prod'
  );

  easebuzzCheckout.initiatePayment(options, (response: EasebuzzResponse) => {
    if (response.status === 'success') {
      onSuccess(response);
    } else {
      onFailure(new Error(response.error_Message || 'Payment failed'));
    }
  });
};