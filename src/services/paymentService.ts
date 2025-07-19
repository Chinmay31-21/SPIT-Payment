import axios from 'axios';
import { PaymentForm, PaymentOrder, PaymentRecord, PaymentVerification } from '../types/payment';

// The URL of your new backend server
const API_URL = 'http://localhost:5000/api/payments';

class PaymentService {
  private baseURL = API_URL;
  private easyCollectURL = 'https://pay.easebuzz.in/payment/initiateLink';

  // Method 1: Create Easy Collect Payment Link (updated to call a backend)
  async createEasyCollectLink(paymentData: PaymentForm): Promise<PaymentOrder> {
    // In a real app, this would call your backend which then calls Easebuzz
    // For now, we keep the simulation but point to a potential backend endpoint
    console.log("In a production app, you would call: POST /api/payments/create-easy-collect");
    const { data } = await axios.post(`${this.baseURL}/create-easy-collect`, paymentData);
    return data;
  }

  // Method 2: Create payment order (traditional checkout)
  // This now calls YOUR backend to get order details and the payment hash
  async createOrder(paymentData: PaymentForm): Promise<PaymentOrder> {
    const { data } = await axios.post(`${this.baseURL}/create-order`, paymentData);
    // The backend now returns the orderId, amount, and the crucial accessKey (hash)
    return data;
  }

  // Verification is now handled by the backend via webhooks.
  // This function can be used to check the status from the frontend if needed.
  async getPaymentRecord(orderId: string): Promise<PaymentRecord | null> {
    try {
        const { data } = await axios.get(`${this.baseURL}/record/${orderId}`);
        return data;
    } catch (error) {
        console.error("Could not fetch payment record", error);
        return null;
    }
  }

  // Clear local payment data (no changes needed here)
  clearPaymentData(): void {
    localStorage.removeItem('currentPayment');
    localStorage.removeItem('paymentRecord');
  }
}

export const paymentService = new PaymentService();