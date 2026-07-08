import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getPaymentMethodLabel, getPaymentStatusLabel } from '../utils/payment';

export default function Orders() {
  const { fetchOrders } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [fetchOrders]);

  return (
    <main className="container page-main">
      <h1 className="page-title">My Orders</h1>

      {loading ? (
        <p className="empty-state card">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="empty-state card">
          <p>You have no orders yet.</p>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 700 }}>Start shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="card order-card">
              <div className="order-card-header">
                <div>
                  <strong>Order #{order.id.slice(-8).toUpperCase()}</strong>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="order-card-meta">
                  <span className="order-status-badge">{order.status}</span>
                  <strong>${order.total?.toFixed(2)}</strong>
                </div>
              </div>
              <div className="order-card-payment-meta">
                <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                <span>{getPaymentStatusLabel(order.paymentStatus)}</span>
              </div>
              <div className="order-card-items">
                {order.items?.map((item) => (
                  <div key={`${order.id}-${item.id}`} className="order-card-item">
                    <img src={item.images?.[0]} alt={item.title} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>Qty {item.quantity} · ${item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {order.shipping && (
                <p className="order-card-shipping">
                  Shipped to {order.shipping.fullName}, {order.shipping.city}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
