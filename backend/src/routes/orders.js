import express from 'express';
import authenticate from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { formatOrder } from '../utils/serialize.js';
import { getStripe, isStripeConfigured } from '../config/stripe.js';
import {
  buildOrderItemsFromCart,
  fulfillOrder,
  normalizeShipping,
  validateShipping,
} from '../utils/checkout.js';

const router = express.Router();

const isCardPayment = (paymentMethod) => paymentMethod === 'card' || paymentMethod === 'stripe';

const cancelPendingOrder = async (order) => {
  if (!order || order.status !== 'pending_payment') return;

  if (order.stripePaymentIntentId && isStripeConfigured()) {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'requires_confirmation') {
      await stripe.paymentIntents.cancel(order.stripePaymentIntentId);
    }
  }

  order.status = 'cancelled';
  order.paymentStatus = 'cancelled';
  await order.save();
};

router.get('/', authenticate, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders: orders.map(formatOrder) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.post('/create-payment', authenticate, async (req, res, next) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ message: 'Card payments are not configured yet' });
    }

    const { shipping } = req.body;
    const shippingError = validateShipping(shipping);
    if (shippingError) {
      return res.status(400).json({ message: shippingError });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.cart?.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const existingPendingOrders = await Order.find({
      userId: user._id.toString(),
      status: 'pending_payment',
      paymentMethod: 'card',
    });

    for (const pendingOrder of existingPendingOrders) {
      await cancelPendingOrder(pendingOrder);
    }

    const { orderItems, total } = await buildOrderItemsFromCart(user.cart);
    const amountInCents = Math.round(total * 100);

    if (amountInCents < 50) {
      return res.status(400).json({ message: 'Order total must be at least $0.50' });
    }

    const order = await Order.create({
      userId: user._id.toString(),
      items: orderItems,
      shipping: normalizeShipping(shipping),
      paymentMethod: 'card',
      total,
      status: 'pending_payment',
      paymentStatus: 'pending',
    });

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      metadata: {
        orderId: order._id.toString(),
        userId: user._id.toString(),
      },
      receipt_email: normalizeShipping(shipping).email,
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.status(201).json({
      order: formatOrder(order),
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/cancel-payment', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending_payment') {
      return res.status(400).json({ message: 'Only pending card payments can be cancelled' });
    }

    await cancelPendingOrder(order);

    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/confirm-payment', authenticate, async (req, res, next) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ message: 'Card payments are not configured yet' });
    }

    const order = await Order.findById(req.params.id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'confirmed') {
      return res.json({ order: formatOrder(order) });
    }

    if (!order.stripePaymentIntentId) {
      return res.status(400).json({ message: 'This order does not have a Stripe payment' });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment has not been completed yet' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await fulfillOrder(order, user);

    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.post('/checkout', authenticate, async (req, res, next) => {
  try {
    const { shipping, paymentMethod } = req.body;

    if (isCardPayment(paymentMethod)) {
      return res.status(400).json({
        message: 'Use the card payment flow to pay with Stripe',
      });
    }

    const shippingError = validateShipping(shipping);
    if (shippingError) {
      return res.status(400).json({ message: shippingError });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.cart?.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const { orderItems, total } = await buildOrderItemsFromCart(user.cart);

    const order = await Order.create({
      userId: user._id.toString(),
      items: orderItems,
      shipping: normalizeShipping(shipping),
      paymentMethod: 'cod',
      total,
      status: 'confirmed',
      paymentStatus: 'cod',
    });

    await fulfillOrder(order, user);

    res.status(201).json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

export default router;
