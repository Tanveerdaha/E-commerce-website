import { Fragment, useCallback, useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import { useAdmin } from '../../context/AdminContext';

export default function AdminOrders() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet('/admin/orders', token);
      setOrders(data.orders || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p>View all customer orders and shipping details.</p>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap card">
        {loading ? (
          <p className="admin-table-empty">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="admin-table-empty">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Email</th>
                <th>City</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <tr>
                    <td><strong>#{order.id.slice(-8).toUpperCase()}</strong></td>
                    <td>{order.customer.name}</td>
                    <td>{order.customer.email}</td>
                    <td>{order.customer.city}</td>
                    <td>{order.itemCount}</td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td><span className="admin-status-badge">{order.status}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className="btn admin-secondary-btn"
                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                      >
                        {expandedId === order.id ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr className="admin-order-details-row">
                      <td colSpan={9}>
                        <div className="admin-order-details">
                          <div>
                            <h4>Customer</h4>
                            <p><strong>{order.customer.name}</strong></p>
                            <p>{order.customer.email}</p>
                            <p>{order.customer.phone}</p>
                            <p>{order.customer.address}, {order.customer.city} {order.customer.postalCode}</p>
                            <p>Payment: {order.paymentMethod === 'card' ? 'Card (demo)' : 'Cash on delivery'}</p>
                          </div>
                          <div>
                            <h4>Items</h4>
                            <ul className="admin-order-items-list">
                              {order.items?.map((item) => (
                                <li key={`${order.id}-${item.id}`}>
                                  <img src={item.images?.[0]} alt={item.title} />
                                  <span>{item.title} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
