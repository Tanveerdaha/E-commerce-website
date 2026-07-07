import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <main className="container page-main">
        <div className="empty-state card">Product not found.</div>
      </main>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <main className="container page-main">
      <Link to="/products" className="product-detail-back">← Back to Products</Link>
      <div className="product-detail-grid">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card product-detail-image-card">
          <img src={product.images[0]} alt={product.title} className="product-detail-image" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="product-detail-category">{product.category}</p>
          <h1 className="product-detail-title">{product.title}</h1>
          <p className="product-detail-desc">{product.description}</p>
          <div className="product-detail-price-row">
            <strong className="product-detail-price">${product.price}</strong>
            <span className="product-detail-rating">★ {product.rating}</span>
          </div>
          <div className="product-detail-actions">
            <button type="button" className="btn" onClick={() => addToCart(product)} style={{ background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <FiShoppingBag /> Add to Cart
            </button>
            <button type="button" className="btn" onClick={() => toggleWishlist(product)} style={{ background: 'white', color: isWishlisted ? '#ef4444' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <FiHeart /> Wishlist
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
