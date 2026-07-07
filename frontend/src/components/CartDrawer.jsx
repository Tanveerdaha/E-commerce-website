import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cart-drawer-backdrop"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="cart-drawer"
          >
            <div className="cart-drawer-header">
              <h2>Your Cart</h2>
              <button type="button" className="btn" onClick={() => setIsCartOpen(false)} style={{ background: '#f8fafc', padding: '0.6rem' }}>
                <FiX />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="cart-drawer-empty">Your cart is empty.</div>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                  {cart.map((item) => (
                    <div key={item.id} className="card cart-drawer-item">
                      <img src={item.images[0]} alt={item.title} />
                      <div className="cart-drawer-item-body">
                        <div className="cart-drawer-item-top">
                          <strong>{item.title}</strong>
                          <button type="button" onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                            <FiTrash2 />
                          </button>
                        </div>
                        <p className="cart-drawer-item-price">${item.price}</p>
                        <div className="cart-drawer-item-footer">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button type="button" className="btn" onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.35rem', background: '#f8fafc' }}><FiMinus /></button>
                            <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                            <button type="button" className="btn" onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.35rem', background: '#f8fafc' }}><FiPlus /></button>
                          </div>
                          <strong>${item.price * item.quantity}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card cart-drawer-summary">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <strong>${subtotal}</strong>
                  </div>
                  <Link to="/checkout" className="btn cart-checkout-btn" onClick={() => setIsCartOpen(false)}>
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
