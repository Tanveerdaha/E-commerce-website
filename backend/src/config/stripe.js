import Stripe from 'stripe';

let stripeClient = null;

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
};

export default stripeClient;
