import { PaymentForm, PaymentOrder, PaymentVerification, PaymentRecord } from '../types/payment';

// Payment service with Easy Collect integration
class PaymentService {
  private baseURL = '/api/payments';
  private easyCollectURL = 'https://pay.easebuzz.in/payment/initiateLink';

  // Method 1: Create Easy Collect Payment Link
  async createEasyCollectLink(paymentData: PaymentForm): Promise<PaymentOrder> {
    // In production, this should be called from your backend
    const easyCollectData = {
      name: paymentData.fullName,
      email: paymentData.email,
      phone: paymentData.phone,
      amount: paymentData.amount,
      purpose: `Fee for ${paymentData.courseName} - ${paymentData.collegeName}`,
      send_sms: false,
      send_email: false,
      webhook_url: `${window.location.origin}/api/payments/webhook`,
      redirect_url: `${window.location.origin}/payment/success`
    };

    // Simulate API call - in production, call your backend which then calls Easebuzz
    return new Promise((resolve) => {
      setTimeout(() => {
        const collectId = `collect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const paymentLink = `https://pay.easebuzz.in/easy_collect/${collectId}`;
        
        resolve({
          orderId: collectId,
          paymentLink,
          collectId,
          amount: paymentData.amount,
          currency: 'INR'
        });
      }, 1000);
    });
  }

  // Method 2: Create payment order (traditional checkout)
  async createOrder(paymentData: PaymentForm): Promise<PaymentOrder> {
    // Simulate API call - in real app, this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        resolve({
          orderId,
          easebuzzKey: 'EASEBUZZ_TEST_KEY',
          amount: paymentData.amount,
          currency: 'INR',
          accessKey: 'EASEBUZZ_ACCESS_KEY'
        });
      }, 1000);
    });
  }

  // Verify payment
  async verifyPayment(verification: PaymentVerification): Promise<PaymentRecord> {
    // Simulate payment verification
    return new Promise((resolve) => {
      setTimeout(() => {
        const paymentRecord: PaymentRecord = {
          id: `payment_${Date.now()}`,
          fullName: JSON.parse(localStorage.getItem('currentPayment') || '{}').fullName,
          email: JSON.parse(localStorage.getItem('currentPayment') || '{}').email,
          phone: JSON.parse(localStorage.getItem('currentPayment') || '{}').phone,
          courseName: JSON.parse(localStorage.getItem('currentPayment') || '{}').courseName,
          collegeName: JSON.parse(localStorage.getItem('currentPayment') || '{}').collegeName,
          amount: JSON.parse(localStorage.getItem('currentPayment') || '{}').amount,
          orderId: verification.txnid,
          paymentId: verification.easepayid,
          transactionId: `TXN_${Date.now()}`,
          status: verification.status === 'success' ? 'success' : 'failed',
          createdAt: new Date(),
          receiptUrl: `/receipts/${verification.easepayid}.pdf`
        };
        
        // Store payment record
        localStorage.setItem('paymentRecord', JSON.stringify(paymentRecord));
        resolve(paymentRecord);
      }, 1500);
    });
  }

  // Get payment record
  getPaymentRecord(): PaymentRecord | null {
    const stored = localStorage.getItem('paymentRecord');
    return stored ? JSON.parse(stored) : null;
  }

  // Clear payment data
  clearPaymentData(): void {
    localStorage.removeItem('currentPayment');
    localStorage.removeItem('paymentRecord');
  }
}

export const paymentService = new PaymentService();