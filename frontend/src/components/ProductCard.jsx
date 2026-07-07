import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <motion.article whileHover={{ y: -6, scale: 1.01 }} className="card product-card">
      <div className="product-card-image-wrap">
        <img src={product.images[0]} alt={product.title} className="product-card-image" />
        <span className="product-card-badge">-{product.discount}%</span>
        <button
          type="button"
          className="product-card-wishlist"
          onClick={() => toggleWishlist(product)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart color={isWishlisted ? '#ef4444' : '#64748b'} />
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-card-category">{product.category}</span>
          <span className="product-card-rating">★ {product.rating}</span>
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-card-title">{product.title}</h3>
        </Link>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <strong className="product-card-price">${product.price}</strong>
          <button type="button" className="btn product-card-add" onClick={() => addToCart(product)}>
            <FiShoppingBag /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
