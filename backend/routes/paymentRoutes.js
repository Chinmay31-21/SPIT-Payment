const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// For Traditional Checkout
router.post('/create-order', paymentController.createOrder);

// For Easy Collect
router.post('/create-easy-collect', paymentController.createEasyCollectLink);

// For handling the redirect from Easebuzz after payment
router.post('/verify-payment', paymentController.verifyPayment);

// For the frontend to fetch the final payment record
router.get('/record/:orderId', paymentController.getPaymentRecord);

module.exports = router;