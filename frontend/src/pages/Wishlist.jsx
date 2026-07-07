import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <main className="container page-main">
      <h1 className="page-title">Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="empty-state card">No saved items yet.</div>
      ) : (
        <div className="grid product-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="card wishlist-card">
              <img src={product.images[0]} alt={product.title} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <div className="wishlist-card-footer">
                <strong>${product.price}</strong>
                <div className="wishlist-card-actions">
                  <button type="button" className="btn" onClick={() => addToCart(product)} style={{ background: '#2563eb', color: 'white', padding: '0.45rem 0.7rem' }}>Add</button>
                  <button type="button" className="btn" onClick={() => toggleWishlist(product)} style={{ background: '#fee2e2', color: '#dc2626', padding: '0.45rem 0.7rem' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p style={{ marginTop: '1rem' }}>
        <Link to="/products" style={{ color: '#2563eb', fontWeight: 700 }}>Continue shopping</Link>
      </p>
    </main>
  );
}
