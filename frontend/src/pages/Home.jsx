import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

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
  const { products, loading } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="hero-eyebrow">New season arrivals</p>
            <h1 className="hero-title">Elevated essentials for a modern lifestyle.</h1>
            <p className="hero-text">Discover premium products crafted to blend timeless style with everyday comfort.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn" style={{ background: '#2563eb', color: 'white' }}>Shop Now</Link>
              <Link to="/wishlist" className="btn" style={{ background: 'white', color: '#334155' }}>View Wishlist</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="card hero-image-card">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80" alt="Modern lifestyle collection" />
          </motion.div>
        </div>
      </section>

      <section className="container section-block">
        <h2>Shop by Category</h2>
        <div className="grid category-grid">
          {categories.map((category) => (
            <motion.div key={category.name} whileHover={{ scale: 1.03 }} className="card category-card">
              <img src={category.image} alt={category.name} />
              <strong>{category.name}</strong>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 700 }}>See all</Link>
        </div>
        <div className="grid product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </section>
    </main>
  );
}
