import { PaymentForm, EasebuzzResponse } from '../types/payment';

// Method 1: Open Easy Collect Payment Link (no changes needed here)
export const openEasyCollectLink = (paymentLink: string): void => {
  const paymentWindow = window.open(
    paymentLink,
    'easebuzz_payment',
    'width=800,height=600,scrollbars=yes,resizable=yes'
  );

  const checkClosed = setInterval(() => {
    if (paymentWindow?.closed) {
      clearInterval(checkClosed);
      console.log('Payment window closed');
    }
  }, 1000);
};

// Method 2: Load Easebuzz SDK for traditional checkout (no changes needed here)
export const loadEasebuzzScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// **UPDATED FUNCTION**
export const openEasebuzzCheckout = (
  order: { orderId: string, accessKey: string, amount: number, easebuzzKey: string },
  paymentData: PaymentForm,
  onSuccess: (response: EasebuzzResponse) => void,
  onFailure: (error: any) => void
): void => {

  const options = {
    access_key: order.accessKey, // Use the accessKey (hash) from YOUR backend
    txnid: order.orderId,      // Use the orderId (txnid) from YOUR backend
    amount: order.amount.toString(),
    firstname: paymentData.fullName.split(' ')[0],
    email: paymentData.email,
    phone: paymentData.phone,
    productinfo: `Fee for ${paymentData.courseName}`,
    surl: `${window.location.origin}/payment/success`,
    furl: `${window.location.origin}/payment/failure`,
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
    order.easebuzzKey, // Your merchant key from the backend
    'test' // Or 'prod' based on your environment
  );

  easebuzzCheckout.initiatePayment(options, (response: EasebuzzResponse) => {
    // This callback is now less critical as backend handles verification,
    // but it's good for updating UI immediately.
    if (response.status === 'success') {
      onSuccess(response);
    } else {
      onFailure(new Error(response.error_Message || 'Payment failed'));
    }
  });
};