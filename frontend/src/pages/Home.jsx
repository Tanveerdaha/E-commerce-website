import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { apiGet } from '../services/api';

const MotionLink = motion(Link);

export default function Home() {
  const { products, loading } = useStore();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    apiGet('/categories')
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
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
            <MotionLink
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              whileHover={{ scale: 1.03 }}
              className="card category-card category-card-link"
            >
              {category.image ? (
                <img src={category.image} alt={category.name} />
              ) : (
                <div className="category-card-placeholder" aria-hidden="true">{category.name.charAt(0)}</div>
              )}
              <strong>{category.name}</strong>
            </MotionLink>
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
            products.slice(0, 10).map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </section>
    </main>
  );
}
