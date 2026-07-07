import { useStore } from '../context/StoreContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, checkout } = useStore();

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Cart</h1>
      {cart.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Your cart is empty.</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
          <div>
            {cart.map((item) => (
              <div key={item.id} className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <img src={item.images[0]} alt={item.title} style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 18 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem' }}>{item.title}</h3>
                  <p style={{ color: '#64748b', margin: '0 0 0.4rem' }}>${item.price}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button className="btn" onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.35rem 0.6rem', background: '#f8fafc' }}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn" onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.35rem 0.6rem', background: '#f8fafc' }}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <strong>${item.price * item.quantity}</strong>
                  <button className="btn" onClick={() => removeFromCart(item.id)} style={{ background: '#fee2e2', color: '#dc2626', padding: '0.4rem 0.8rem' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '1.25rem', height: 'fit-content' }}>
            <h2 style={{ marginTop: 0 }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Subtotal</span><strong>${subtotal}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Shipping</span><strong>Free</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}><span>Total</span><strong>${subtotal}</strong></div>
            <button className="btn" style={{ width: '100%', marginTop: '1rem', background: '#2563eb', color: 'white' }} onClick={() => checkout(subtotal)}>Checkout</button>
          </div>
        </div>
      )}
    </main>
  );
}
