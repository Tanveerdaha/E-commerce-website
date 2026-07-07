import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', zIndex: 1000 }} />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} style={{ position: 'fixed', top: 0, right: 0, width: 'min(420px, 100%)', height: '100%', background: 'white', zIndex: 1001, boxShadow: '-12px 0 35px rgba(0,0,0,0.15)', padding: '1.25rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Your Cart</h2>
              <button className="btn" onClick={() => setIsCartOpen(false)} style={{ background: '#f8fafc', padding: '0.6rem' }}>
                <FiX />
              </button>
            </div>
            {cart.length === 0 ? (
              <div style={{ display: 'grid', placeItems: 'center', height: '70%', color: '#64748b' }}>Your cart is empty.</div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="card" style={{ padding: '0.9rem', marginBottom: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                    <img src={item.images[0]} alt={item.title} style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 16 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{item.title}</strong>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}><FiTrash2 /></button>
                      </div>
                      <p style={{ color: '#64748b', margin: '0.25rem 0' }}>${item.price}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button className="btn" onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.35rem', background: '#f8fafc' }}><FiMinus /></button>
                          <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                          <button className="btn" onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.35rem', background: '#f8fafc' }}><FiPlus /></button>
                        </div>
                        <strong>${item.price * item.quantity}</strong>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Subtotal</span>
                    <strong>${subtotal}</strong>
                  </div>
                  <button className="btn" style={{ width: '100%', background: '#2563eb', color: 'white' }}>Checkout</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
