const crypto = require('crypto');
const axios = require('axios');
const { User, Course, Payment } = require('../models');
require('dotenv').config();

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY;
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT;
const EASEBUZZ_API_URL = process.env.EASEBUZZ_API_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

// --- Helper function to generate hash for traditional checkout ---
const generatePaymentHash = (data) => {
  const hashstring = `${EASEBUZZ_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|${data.udf6}|${data.udf7}|${data.udf8}|${data.udf9}|${data.udf10}|${EASEBUZZ_SALT}`;
  return crypto.createHash('sha512').update(hashstring).digest('hex');
};

// --- Controller for Traditional Checkout ---
exports.createOrder = async (req, res) => {
  try {
    const { fullName, email, phone, courseName, collegeName, amount } = req.body;

    const [user] = await User.findOrCreate({ where: { email }, defaults: { fullName, phone, collegeName } });
    const [course] = await Course.findOrCreate({ where: { courseName }, defaults: { courseFee: amount } });

    const txnid = `SPIT_TRAD_${Date.now()}`;
    await Payment.create({ userId: user.id, courseId: course.id, orderId: txnid, amount, status: 'pending' });

    const paymentPayload = {
      txnid: txnid,
      amount: parseFloat(amount).toFixed(2),
      productinfo: courseName,
      firstname: fullName,
      email: email,
      phone: phone,
      udf1: courseName,
      udf2: collegeName,
      udf3: '', udf4: '', udf5: '', udf6: '', udf7: '', udf8: '', udf9: '', udf10: ''
    };

    const hash = generatePaymentHash(paymentPayload);

    res.json({
        orderId: txnid,
        amount: parseFloat(amount),
        accessKey: hash, // The 'accessKey' is the payment hash
        easebuzzKey: EASEBUZZ_KEY
    });

  } catch (error) {
    console.error("Error creating traditional order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// --- Controller for Easy Collect Link ---
exports.createEasyCollectLink = async (req, res) => {
    try {
        const { fullName, email, phone, courseName, collegeName, amount } = req.body;

        const [user] = await User.findOrCreate({ where: { email }, defaults: { fullName, phone, collegeName } });
        const [course] = await Course.findOrCreate({ where: { courseName }, defaults: { courseFee: amount } });

        const txnid = `SPIT_EASY_${Date.now()}`;
        const payment = await Payment.create({ userId: user.id, courseId: course.id, orderId: txnid, amount, status: 'pending' });

        const easyCollectPayload = {
            key: EASEBUZZ_KEY,
            txnid: txnid,
            amount: parseFloat(amount).toFixed(2),
            productinfo: courseName,
            firstname: fullName,
            email: email,
            phone: phone,
            surl: `${FRONTEND_URL}/payment-redirect`, // Your redirect URL for the webhook
            furl: `${FRONTEND_URL}/payment-redirect`,
        };

        const hash = generatePaymentHash(easyCollectPayload);
        easyCollectPayload.hash = hash;

        // Call Easebuzz API to get the payment link
        const { data } = await axios.post(`${EASEBUZZ_API_URL}/payment/initiate`, new URLSearchParams(easyCollectPayload));

        if (data.status === 1 && data.data) {
            const paymentLink = `${EASEBUZZ_API_URL}/pay/${data.data}`;
            payment.paymentLink = paymentLink;
            await payment.save();
            res.json({ orderId: txnid, paymentLink, amount: parseFloat(amount) });
        } else {
            throw new Error(data.error_desc || "Failed to create Easy Collect link");
        }
    } catch (error) {
        console.error("Error creating Easy Collect link:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to create Easy Collect link" });
    }
};


// --- Controller to handle the redirect from Easebuzz and verify payment ---
exports.verifyPayment = async (req, res) => {
    const { status, txnid, easepayid, hash } = req.body;
    const key = EASEBUZZ_KEY;
    const salt = EASEBUZZ_SALT;

    const hashstring = `${salt}|${status}|${req.body.udf10}|${req.body.udf9}|${req.body.udf8}|${req.body.udf7}|${req.body.udf6}|${req.body.udf5}|${req.body.udf4}|${req.body.udf3}|${req.body.udf2}|${req.body.udf1}|${req.body.email}|${req.body.firstname}|${req.body.productinfo}|${req.body.amount}|${txnid}|${key}`;
    const generatedHash = crypto.createHash('sha512').update(hashstring).digest('hex');

    if (generatedHash === hash) {
        const payment = await Payment.findOne({ where: { orderId: txnid } });
        if (payment) {
            payment.status = status; // 'success' or 'failure'
            payment.easebuzzId = easepayid;
            await payment.save();
        }
        // Redirect back to the frontend with status
        res.redirect(`${FRONTEND_URL}?txnid=${txnid}&status=${status}`);
    } else {
        // Redirect back to the frontend with a failure status
        res.redirect(`${FRONTEND_URL}?txnid=${txnid}&status=failure&error=hash_mismatch`);
    }
};

// --- Controller for the frontend to fetch final payment details ---
exports.getPaymentRecord = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await Payment.findOne({
            where: { orderId: orderId },
            include: [User, Course] // Include related user and course data
        });

        if (!payment) {
            return res.status(404).json({ error: "Payment record not found" });
        }

        // Format the response to match the frontend's PaymentRecord interface
        const paymentRecord = {
            id: payment.id,
            fullName: payment.User.fullName,
            email: payment.User.email,
            phone: payment.User.phone,
            courseName: payment.Course.courseName,
            collegeName: payment.User.collegeName,
            amount: payment.amount,
            orderId: payment.orderId,
            paymentId: payment.easebuzzId,
            transactionId: payment.easebuzzId, // Often the same as paymentId
            status: payment.status,
            createdAt: payment.created_at,
        };

        res.json(paymentRecord);
    } catch (error) {
        console.error("Error fetching payment record:", error);
        res.status(500).json({ error: "Failed to fetch payment record" });
    }
};