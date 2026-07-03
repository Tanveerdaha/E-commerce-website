import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import products from '../data/products';
import { useStore } from '../context/StoreContext';

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const { addToCart, toggleWishlist, wishlist } = useStore();

  if (!product) return <div className="container" style={{ padding: '3rem 0' }}>Product not found.</div>;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <Link to="/products" style={{ color: '#2563eb', fontWeight: 700, display: 'inline-block', marginBottom: '1rem' }}>← Back to Products</Link>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '1rem' }}>
          <img src={product.images[0]} alt={product.title} style={{ height: 420, objectFit: 'cover', borderRadius: 24 }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>{product.category}</p>
          <h1 style={{ margin: '0 0 0.7rem' }}>{product.title}</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>{product.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <strong style={{ fontSize: '1.4rem' }}>${product.price}</strong>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {product.rating}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button className="btn" onClick={() => addToCart(product)} style={{ background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FiShoppingBag /> Add to Cart
            </button>
            <button className="btn" onClick={() => toggleWishlist(product)} style={{ background: 'white', color: isWishlisted ? '#ef4444' : '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FiHeart /> Wishlist
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
