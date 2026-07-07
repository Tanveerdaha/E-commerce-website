import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="card"
      style={{ overflow: 'hidden' }}
    >
      <div style={{ position: 'relative' }}>
        <img src={product.images[0]} alt={product.title} style={{ height: 220, objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: 12, left: 12, background: '#f59e0b', color: 'white', borderRadius: '999px', padding: '0.35rem 0.7rem', fontSize: '0.8rem', fontWeight: 700 }}>
          -{product.discount}%
        </span>
        <button onClick={() => toggleWishlist(product)} style={{ position: 'absolute', top: 12, right: 12, background: 'white', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <FiHeart color={isWishlisted ? '#ef4444' : '#64748b'} />
        </button>
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{product.category}</span>
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {product.rating}</span>
        </div>
        <Link to={`/products/${product.id}`}><h3 style={{ margin: '0 0 0.3rem' }}>{product.title}</h3></Link>
        <p style={{ color: '#64748b', margin: '0 0 0.75rem' }}>{product.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '1.1rem' }}>${product.price}</strong>
          </div>
          <button className="btn" onClick={() => addToCart(product)} style={{ background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FiShoppingBag /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
