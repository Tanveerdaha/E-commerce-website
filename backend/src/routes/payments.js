import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { getStripe } from '../config/stripe.js';
import { fulfillOrder } from '../utils/checkout.js';

const router = express.Router();

async function confirmStripeOrder(paymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  const order = await Order.findById(orderId);
  if (!order || order.status === 'confirmed') return;

  if (order.stripePaymentIntentId && order.stripePaymentIntentId !== paymentIntent.id) {
    return;
  }

  const user = await User.findById(order.userId);
  if (!user) return;

  await fulfillOrder(order, user);
}

router.post('/', async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ message: 'Stripe webhook secret is not configured' });
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await confirmStripeOrder(event.data.object);
        break;
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const order = await Order.findById(paymentIntent.metadata?.orderId);
        if (order && order.status !== 'confirmed') {
          order.status = 'payment_failed';
          order.paymentStatus = 'failed';
          await order.save();
        }
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook handler failed:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
});

export default router;
