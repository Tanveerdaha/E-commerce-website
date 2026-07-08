import { Link, Navigate, useLocation } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { getOrderStatusCopy, getPaymentMethodLabel, getPaymentStatusLabel } from '../utils/payment';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;
  const statusCopy = getOrderStatusCopy(order);

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <main className="container page-main">
      <div className="order-success card">
        <FiCheckCircle className="order-success-icon" />
        <h1>{statusCopy.title}</h1>
        <p>{statusCopy.message}</p>

        <div className="order-success-details">
          <div><span>Order ID</span><strong>#{order.id.slice(-8).toUpperCase()}</strong></div>
          <div><span>{statusCopy.totalLabel}</span><strong>${order.total?.toFixed(2)}</strong></div>
          <div><span>Payment</span><strong>{getPaymentMethodLabel(order.paymentMethod)}</strong></div>
          <div><span>Payment status</span><strong>{getPaymentStatusLabel(order.paymentStatus)}</strong></div>
          <div><span>Status</span><strong className="order-status-confirmed">{order.status}</strong></div>
        </div>

        {order.shipping && (
          <div className="order-success-shipping">
            <h3>Shipping to</h3>
            <p>{order.shipping.fullName}</p>
            <p>{order.shipping.address}, {order.shipping.city}</p>
            <p>{order.shipping.phone} · {order.shipping.email}</p>
          </div>
        )}

        <div className="order-success-actions">
          <Link to="/orders" className="btn" style={{ background: '#2563eb', color: 'white' }}>View my orders</Link>
          <Link to="/products" className="btn" style={{ background: '#f1f5f9', color: '#334155' }}>Continue shopping</Link>
        </div>
      </div>
    </main>
  );
}
