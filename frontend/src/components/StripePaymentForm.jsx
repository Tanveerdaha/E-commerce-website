import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

export default function StripePaymentForm({ amount, onSuccess, onCancel, shippingSummary }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        await onSuccess(paymentIntent);
      } else {
        setError('Payment was not completed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="stripe-payment-form" onSubmit={handleSubmit}>
      {shippingSummary && (
        <div className="stripe-payment-summary">
          <p><strong>Paying with Stripe</strong></p>
          <p>{shippingSummary.fullName} · {shippingSummary.email}</p>
          <p>{shippingSummary.address}, {shippingSummary.city}</p>
        </div>
      )}
      <PaymentElement />
      {error && <p className="checkout-error">{error}</p>}
      <div className="stripe-payment-actions">
        <button type="button" className="btn stripe-cancel-btn" onClick={onCancel} disabled={loading}>
          Cancel payment
        </button>
        <button type="submit" className="btn checkout-submit-btn" disabled={!stripe || loading}>
          {loading ? 'Processing payment...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}
