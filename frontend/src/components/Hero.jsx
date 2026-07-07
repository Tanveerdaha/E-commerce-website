import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section style={{ padding: '2rem 0 3rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>New season arrivals</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: 1.1, margin: '0.4rem 0 1rem' }}>Elevated essentials for a modern lifestyle.</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 560 }}>Discover premium products crafted to blend timeless style with everyday comfort.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <Link to="/products" className="btn" style={{ background: '#2563eb', color: 'white' }}>Shop Now</Link>
            <Link to="/wishlist" className="btn" style={{ background: 'white', color: '#334155' }}>View Wishlist</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '1rem', borderRadius: '32px' }}>
          <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80" alt="hero" style={{ height: 420, objectFit: 'cover', borderRadius: '24px' }} />
        </motion.div>
      </div>
    </section>
  );
}
