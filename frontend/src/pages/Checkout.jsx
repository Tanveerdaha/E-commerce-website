import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTruck } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import { getDiscountedPrice, getItemLineTotal } from '../utils/pricing';

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
  const { cart, auth, subtotal, checkout } = useStore();
  const [shipping, setShipping] = useState({
    ...emptyShipping,
    fullName: auth?.user?.name || '',
    email: auth?.user?.email || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const order = await checkout(shipping, paymentMethod);
      navigate('/order-success', { state: { order }, replace: true });
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page-main">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form card" onSubmit={handleSubmit}>
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
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <FiTruck />
              <span>Cash on delivery</span>
            </label>
            <label className={`checkout-payment-option${paymentMethod === 'card' ? ' active' : ''}`}>
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              <FiCreditCard />
              <span>Card (demo)</span>
            </label>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button type="submit" className="btn checkout-submit-btn" disabled={loading}>
            {loading ? 'Placing order...' : `Place order · $${subtotal.toFixed(2)}`}
          </button>
        </form>

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
