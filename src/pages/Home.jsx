import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import products from '../data/products';
import ProductCard from '../components/ProductCard';

const categories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
  },
];

export default function Home() {
  return (
    <main>
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

      <section className="container" style={{ paddingBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Shop by Category</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {categories.map((category) => (
            <motion.div key={category.name} whileHover={{ scale: 1.03 }} className="card" style={{ padding: '1.25rem', textAlign: 'center', overflow: 'hidden' }}>
              <img
                src={category.image}
                alt={category.name}
                style={{ height: 90, width: '100%', objectFit: 'cover', borderRadius: 18, marginBottom: '0.75rem' }}
              />
              <strong>{category.name}</strong>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Featured Products</h2>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 700 }}>See all</Link>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
