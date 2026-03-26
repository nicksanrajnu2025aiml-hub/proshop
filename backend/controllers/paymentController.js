import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are missing: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// @desc    Create Razorpay order for an existing order
// @route   POST /api/payments/razorpay/order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order already paid' });
    }

    const amount = Math.max(1, Math.round(order.totalPrice * 100)); // paise
    const options = {
      amount,
      currency: 'INR',
      receipt: `rcpt_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    };

    const razor = getRazorpayClient();
    const razorOrder = await razor.orders.create(options);
    return res.json({
      orderId: razorOrder.id,
      amount,
      currency: options.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to create Razorpay order' });
  }
};

// @desc    Verify Razorpay payment signature and mark order paid
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const razor = getRazorpayClient();
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'paid';
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.user.email || '',
      gateway: 'razorpay',
      razorpay_order_id,
      razorpay_signature,
    };

    const updated = await order.save();
    return res.json({ success: true, order: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Payment verification failed' });
  }
};

export { createRazorpayOrder, verifyRazorpayPayment };
