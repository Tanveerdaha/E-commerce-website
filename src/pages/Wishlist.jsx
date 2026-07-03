import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No saved items yet.</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {wishlist.map((product) => (
            <div key={product.id} className="card" style={{ padding: '1rem' }}>
              <img src={product.images[0]} alt={product.title} style={{ height: 200, objectFit: 'cover', borderRadius: 18 }} />
              <h3 style={{ marginBottom: '0.25rem' }}>{product.title}</h3>
              <p style={{ color: '#64748b', margin: '0 0 0.75rem' }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>${product.price}</strong>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" onClick={() => addToCart(product)} style={{ background: '#2563eb', color: 'white', padding: '0.45rem 0.7rem' }}>Add</button>
                  <button className="btn" onClick={() => toggleWishlist(product)} style={{ background: '#fee2e2', color: '#dc2626', padding: '0.45rem 0.7rem' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <Link to="/products" style={{ color: '#2563eb', fontWeight: 700 }}>Continue shopping</Link>
      </div>
    </main>
  );
}
