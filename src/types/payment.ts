export interface PaymentForm {
  fullName: string;
  email: string;
  phone: string;
  courseName: string;
  collegeName: string;
  amount: number;
}

export interface PaymentOrder {
  orderId: string;
  paymentLink?: string;
  collectId?: string;
  amount: number;
  currency: string;
  easebuzzKey?: string;
  accessKey?: string;
}

export interface PaymentVerification {
  easepayid: string;
  txnid: string;
  amount: string;
  status: string;
  hash: string;
}

export interface PaymentRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseName: string;
  collegeName: string;
  amount: number;
  orderId: string;
  paymentId: string;
  transactionId: string;
  status: 'created' | 'success' | 'failed';
  createdAt: Date;
  receiptUrl?: string;
}

export interface EasebuzzResponse {
  easepayid: string;
  txnid: string;
  amount: string;
  status: string;
  hash: string;
  payment_source: string;
  PG_TYPE: string;
  bank_ref_num: string;
  bankcode: string;
  error: string;
  error_Message: string;
}

export interface EasyCollectRequest {
  name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
  send_sms?: boolean;
  send_email?: boolean;
  webhook_url?: string;
  redirect_url?: string;
}

export interface EasyCollectResponse {
  status: number;
  msg: string;
  data: {
    id: string;
    payment_url: string;
    name: string;
    email: string;
    phone: string;
    amount: number;
    purpose: string;
    status: string;
    send_sms: boolean;
    send_email: boolean;
    webhook_url: string;
    redirect_url: string;
    created_at: string;
    updated_at: string;
  };
}

declare global {
  interface Window {
    EasebuzzCheckout: any;
  }
}

