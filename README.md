# SPIT Allied Division Payment Gateway - Easebuzz Integration

A comprehensive payment application for SPIT Allied Division certificate course fee collection, featuring **Easebuzz Easy Collect** and traditional checkout integration.

## Features

- **Dual Payment Methods**: Easy Collect Links + Traditional Checkout Modal
- **Easy Collect Integration**: Direct payment links like `https://pay.easebuzz.in/easy_collect/xxx`
- **Multi-step Payment Flow**: Form → Confirmation → Payment Link/Checkout → Receipt
- **Multiple Payment Options**: Credit Card, Debit Card, UPI, Net Banking, Wallets
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Receipt Generation**: Automatic PDF receipt generation and download
- **Error Handling**: Comprehensive error handling with retry options
- **Real-time Validation**: Form validation with instant feedback
- **Animations**: Smooth transitions using Framer Motion
- **Toast Notifications**: User-friendly notifications for all actions

## Payment Methods

### 1. Easy Collect (Recommended)
- Generates direct payment links like the one you provided
- Opens in new window/tab for secure payment
- Perfect for sharing via SMS, email, or WhatsApp
- Matches the exact UI shown in your screenshot

### 2. Traditional Checkout
- Embedded payment modal
- Seamless in-app experience
- Immediate payment processing

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Payment**: Easebuzz Checkout
- **PDF Generation**: jsPDF
- **Build Tool**: Vite
- **Notifications**: React Hot Toast

## Setup Instructions

### 1. Easebuzz Account Setup

Create an account at [Easebuzz Merchant Dashboard](https://dashboard.easebuzz.in):

1. **Get API Credentials**:
   - Merchant Key
   - Salt/Secret Key
   - Environment (test/prod)

2. **Easy Collect Setup**:
   - Enable Easy Collect in your dashboard
   - Configure webhook URLs
   - Set up success/failure redirect URLs

### 1. Clone and Install

```bash
git clone <repository-url>
cd spit-payment-app
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Easebuzz Configuration
VITE_EASEBUZZ_MERCHANT_KEY=your_easebuzz_merchant_key
VITE_EASEBUZZ_SALT=your_easebuzz_salt
VITE_EASEBUZZ_ENVIRONMENT=test

# Easy Collect API
VITE_EASEBUZZ_EASY_COLLECT_URL=https://pay.easebuzz.in/payment/initiateLink
```

### 3. Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Easebuzz Integration Details

### Easy Collect API Integration

The application uses Easebuzz's Easy Collect API to generate payment links:

```javascript
// Backend API call to create Easy Collect link
const response = await fetch('https://pay.easebuzz.in/payment/initiateLink', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    name: 'Student Name',
    email: 'student@example.com',
    phone: '9876543210',
    amount: 1000,
    purpose: 'Course Fee Payment',
    webhook_url: 'https://yoursite.com/webhook',
    redirect_url: 'https://yoursite.com/success'
  })
});
```

### Payment Link Format

Generated links follow this pattern:
```
https://pay.easebuzz.in/easy_collect/[UNIQUE_ID]
```

Example: `https://pay.easebuzz.in/easy_collect/18aba9db1aa94b4397df2da160721924`

### Test Credentials

For testing purposes, use these credentials:

- **UPI**: Use any UPI ID for testing
- **Card**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Net Banking**: Select any bank for testing

### Production Setup

1. **Merchant Dashboard**: Get production credentials
2. **API Integration**: Update environment variables
3. **Webhook Setup**: Configure production webhook URLs
4. Update environment variables
5. Set environment to 'prod' for production

### Webhook Configuration

Set up these webhook URLs in your Easebuzz dashboard:

- **Payment Success**: `https://yourdomain.com/api/payments/webhook/success`
- **Payment Failure**: `https://yourdomain.com/api/payments/webhook/failure`
- **Payment Pending**: `https://yourdomain.com/api/payments/webhook/pending`

## Payment Flow

### Easy Collect Flow
1. **Form Submission**: User fills payment details
2. **Confirmation**: Review and confirm payment details
3. **Link Generation**: Backend creates Easy Collect payment link
4. **Payment Window**: Link opens in new window/tab
5. **Payment Processing**: User completes payment on Easebuzz page
6. **Webhook Notification**: Easebuzz notifies your backend
7. **Receipt**: Success page with PDF receipt download

### Traditional Checkout Flow
1. **Form Submission**: User fills payment details
2. **Confirmation**: Review and confirm payment details
3. **Easebuzz Modal**: Embedded checkout modal opens
4. **Verification**: Backend verification of payment
5. **Receipt**: PDF receipt generation and download

## File Structure

```
src/
├── components/
│   ├── PaymentForm.tsx          # Main payment form
│   ├── ConfirmationModal.tsx    # Payment confirmation modal
│   ├── PaymentLinkModal.tsx     # Easy Collect link display
│   ├── PaymentSuccess.tsx       # Success screen
│   └── PaymentFailure.tsx       # Failure screen
├── services/
│   └── paymentService.ts        # Payment API service
├── utils/
│   ├── easebuzz.ts             # Easebuzz utilities
│   └── receiptGenerator.ts      # PDF receipt generator
├── types/
│   └── payment.ts              # TypeScript interfaces
└── App.tsx                     # Main application component
```

## Backend Integration

For production, implement these API endpoints:

- `POST /api/payments/create-easy-collect` - Create Easy Collect link
- `POST /api/payments/create-order` - Create traditional order
- `POST /api/payments/verify` - Verify payment response
- `POST /api/payments/webhook` - Handle Easebuzz webhooks
- `GET /api/payments/:id/receipt` - Download receipt
- `GET /api/payments/:id/status` - Check payment status

### Sample Easy Collect Backend Implementation

```javascript
// Create Easy Collect Link
app.post('/api/payments/create-easy-collect', async (req, res) => {
  const { fullName, email, phone, courseName, amount } = req.body;
  
  const easyCollectData = {
    name: fullName,
    email,
    phone,
    amount,
    purpose: `Fee for ${courseName}`,
    webhook_url: `${process.env.BASE_URL}/api/payments/webhook`,
    redirect_url: `${process.env.BASE_URL}/payment/success`
  };
  
  // Call Easebuzz Easy Collect API
  const response = await fetch('https://pay.easebuzz.in/payment/initiateLink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.EASEBUZZ_API_KEY}`
    },
    body: JSON.stringify(easyCollectData)
  });
  
  const result = await response.json();
  
  res.json({
    orderId: result.data.id,
    paymentLink: result.data.payment_url,
    collectId: result.data.id,
    amount,
    currency: 'INR',
  });
});

// Webhook Handler
app.post('/api/payments/webhook', async (req, res) => {
  const { txnid, amount, status, easepayid } = req.body;
  
  // Verify webhook authenticity
  const isValid = verifyWebhookSignature(req.body, req.headers);
  
  if (isValid && status === 'success') {
    // Update payment record in database
    await updatePaymentStatus(txnid, 'success', easepayid);
    
    // Generate receipt
    await generateReceipt(txnid);
  }
  
  res.status(200).send('OK');
});
```

## Security Features

- HTTPS enforcement
- Webhook signature verification
- Payment hash verification
- Input validation and sanitization
- Error handling and logging
- Secure payment link generation
- Rate limiting for API endpoints

## Testing

### Test Cases

1. **Form Validation**: Test all field validations
2. **Easy Collect Links**: Test link generation and opening
3. **Payment Success**: Complete payment flow (both methods)
4. **Payment Failure**: Handle payment failures
5. **Webhook Processing**: Test webhook handling
6. **Receipt Generation**: PDF download functionality
7. **Responsive Design**: Mobile and desktop compatibility

### Test Commands

```bash
# Lint code
npm run lint

# Type checking
npm run build
```

### Testing Easy Collect

1. Fill the payment form
2. Select "Easy Collect Link" method
3. Confirm payment details
4. Payment link will be generated
5. Link opens automatically in new window
6. Complete payment using test credentials
7. Webhook will notify your backend
8. Success page shows with receipt download

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Backend Deployment (Railway/Render)

1. Deploy Node.js backend with database
2. Configure Easebuzz Easy Collect API credentials
3. Set up webhook endpoints
3. Set up SSL certificates
4. Configure CORS for payment domains

## Easebuzz Dashboard Configuration

### Required Parameters

- **Merchant Key**: Your unique merchant identifier  
- **Salt/Secret Key**: For hash generation and verification
- **API Key**: For Easy Collect API access
- **Environment**: 'test' for testing, 'prod' for production

### Easy Collect Settings

In your Easebuzz dashboard:

1. **Enable Easy Collect**: Turn on Easy Collect feature
2. **API Access**: Generate API keys for Easy Collect
3. **Webhook URLs**: Configure webhook endpoints
4. **Success/Failure URLs**: Set redirect URLs
5. **Payment Methods**: Enable desired payment options
6. **Branding**: Upload your logo and set theme colors

## Support

For technical support or queries:
- Email: support@spit.ac.in
- Phone: +91-XXXXXXXXXX
- Easebuzz Support: support@easebuzz.in

## Easy Collect vs Traditional Checkout

| Feature | Easy Collect | Traditional Checkout |
|---------|-------------|---------------------|
| Integration | Simple API call | SDK integration required |
| User Experience | Opens in new window | Embedded modal |
| Sharing | Can share payment links | Cannot share |
| Mobile Friendly | Highly optimized | Good |
| Customization | Limited | More control |
| Setup Complexity | Low | Medium |
| **Recommended For** | **Most use cases** | Advanced integrations |

## License

© 2025 SPIT Allied Division. All rights reserved.