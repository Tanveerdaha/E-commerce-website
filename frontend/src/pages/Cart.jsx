import { Link } from 'react-router-dom';
import { getDiscountedPrice, getItemLineTotal } from '../utils/pricing';
import { useStore } from '../context/StoreContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, auth } = useStore();

  return (
    <main className="container page-main">
      <h1 className="page-title">Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-state card">Your cart is empty.</div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((item) => {
              const unit = getDiscountedPrice(item.price, item.discount);
              return (
                <div key={item.id} className="card cart-item">
                  <img src={item.images[0]} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-body">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-price">
                      ${unit.toFixed(2)}
                      {item.discount > 0 && <span className="cart-item-discount"> ({item.discount}% off)</span>}
                    </p>
                    <div className="cart-item-qty">
                      <button type="button" className="btn" onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.35rem 0.6rem', background: '#f8fafc' }}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" className="btn" onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.35rem 0.6rem', background: '#f8fafc' }}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-side">
                    <strong>${getItemLineTotal(item).toFixed(2)}</strong>
                    <button type="button" className="btn" onClick={() => removeFromCart(item.id)} style={{ background: '#fee2e2', color: '#dc2626', padding: '0.4rem 0.8rem' }}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card cart-summary">
            <h2 style={{ marginTop: 0 }}>Order Summary</h2>
            <div className="cart-summary-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div className="cart-summary-row"><span>Shipping</span><strong>Free</strong></div>
            <div className="cart-summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>
            <Link
              to={auth ? '/checkout' : '/login?redirect=/checkout'}
              className="btn cart-checkout-btn"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
      {cart.length === 0 && (
        <p style={{ marginTop: '1rem' }}>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 700 }}>Continue shopping</Link>
        </p>
      )}
    </main>
  );
}
