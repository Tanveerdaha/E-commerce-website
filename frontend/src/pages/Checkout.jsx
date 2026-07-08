import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FiCreditCard, FiTruck } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import StripePaymentForm from '../components/StripePaymentForm';
import { getDiscountedPrice, getItemLineTotal } from '../utils/pricing';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const emptyShipping = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, auth, subtotal, checkout, createStripePayment, confirmStripePayment, cancelStripePayment } = useStore();
  const [shipping, setShipping] = useState({
    ...emptyShipping,
    fullName: auth?.user?.name || '',
    email: auth?.user?.email || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stripeSession, setStripeSession] = useState(null);

  if (!cart.length) {
    return (
      <main className="container page-main">
        <div className="empty-state card">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn" style={{ background: '#2563eb', color: 'white', marginTop: '1rem', display: 'inline-block' }}>
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  const handleChange = (field) => (e) => {
    setShipping((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setStripeSession(null);
    setError('');
  };

  const handleCodSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const order = await checkout(shipping, 'cod');
      navigate('/order-success', { state: { order }, replace: true });
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!stripePromise) {
      setError('Card payments are not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to your frontend environment.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await createStripePayment(shipping);
      setStripeSession(data);
    } catch (err) {
      setError(err.message || 'Unable to start card payment');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async () => {
    const order = await confirmStripePayment(stripeSession.order.id);
    navigate('/order-success', { state: { order }, replace: true });
  };

  const handleStripeCancel = async () => {
    const pendingOrderId = stripeSession?.order?.id;
    setError('');
    setLoading(true);
    try {
      if (pendingOrderId) {
        await cancelStripePayment(pendingOrderId);
      }
      setStripeSession(null);
    } catch (err) {
      setError(err.message || 'Unable to cancel this payment attempt');
    } finally {
      setLoading(false);
    }
  };

  const showStripeForm = paymentMethod === 'card' && stripeSession?.clientSecret;

  return (
    <main className="container page-main">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-form card">
          {!showStripeForm ? (
            <form onSubmit={paymentMethod === 'cod' ? handleCodSubmit : handleCardSubmit}>
              <h2>Shipping details</h2>
              <div className="checkout-form-grid">
                <label className="checkout-field checkout-field-full">
                  Full name
                  <input value={shipping.fullName} onChange={handleChange('fullName')} required />
                </label>
                <label className="checkout-field">
                  Email
                  <input type="email" value={shipping.email} onChange={handleChange('email')} required />
                </label>
                <label className="checkout-field">
                  Phone
                  <input type="tel" value={shipping.phone} onChange={handleChange('phone')} required />
                </label>
                <label className="checkout-field checkout-field-full">
                  Address
                  <input value={shipping.address} onChange={handleChange('address')} required />
                </label>
                <label className="checkout-field">
                  City
                  <input value={shipping.city} onChange={handleChange('city')} required />
                </label>
                <label className="checkout-field">
                  Postal code
                  <input value={shipping.postalCode} onChange={handleChange('postalCode')} />
                </label>
              </div>

              <h2>Payment method</h2>
              <div className="checkout-payment-options">
                <label className={`checkout-payment-option${paymentMethod === 'cod' ? ' active' : ''}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => handlePaymentMethodChange('cod')} />
                  <FiTruck />
                  <span>Cash on delivery</span>
                </label>
                <label className={`checkout-payment-option${paymentMethod === 'card' ? ' active' : ''}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => handlePaymentMethodChange('card')} />
                  <FiCreditCard />
                  <span>Credit / debit card</span>
                </label>
              </div>

              {error && <p className="checkout-error">{error}</p>}

              <button type="submit" className="btn checkout-submit-btn" disabled={loading}>
                {loading
                  ? 'Preparing checkout...'
                  : paymentMethod === 'cod'
                    ? `Place order · $${subtotal.toFixed(2)}`
                    : `Continue to payment · $${subtotal.toFixed(2)}`}
              </button>
            </form>
          ) : (
            <>
              <h2>Card payment</h2>
              <p className="checkout-stripe-note">
                Complete your payment securely with Stripe. Cancelling this step will close the current payment attempt.
              </p>
              <Elements stripe={stripePromise} options={{ clientSecret: stripeSession.clientSecret }}>
                <StripePaymentForm
                  amount={stripeSession.order.total}
                  onSuccess={handleStripeSuccess}
                  onCancel={handleStripeCancel}
                  shippingSummary={shipping}
                />
              </Elements>
            </>
          )}
        </div>

        <aside className="card checkout-summary">
          <h2>Order summary</h2>
          <div className="checkout-items">
            {cart.map((item) => {
              const unit = getDiscountedPrice(item.price, item.discount);
              return (
                <div key={item.id} className="checkout-item">
                  <img src={item.images?.[0]} alt={item.title} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>Qty {item.quantity} · ${unit.toFixed(2)} each</p>
                  </div>
                  <strong>${getItemLineTotal(item).toFixed(2)}</strong>
                </div>
              );
            })}
          </div>
          <div className="cart-summary-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div className="cart-summary-row"><span>Shipping</span><strong>Free</strong></div>
          <div className="cart-summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>
          <Link to="/cart" className="checkout-back-link">← Back to cart</Link>
        </aside>
      </div>
    </main>
  );
}
