import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiPackage, FiShoppingBag, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { apiGet } from '../../services/api';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const { token } = useAdmin();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet('/admin/analytics', token);
        setAnalytics(data.analytics);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const overview = analytics?.overview;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Sales, ratings, and store performance at a glance.</p>
        </div>
      </header>

      <div className="admin-stats-grid">
        <div className="admin-stat-card card">
          <span><FiDollarSign /> Total Revenue</span>
          <strong>{loading ? '—' : `$${overview?.totalRevenue?.toLocaleString()}`}</strong>
        </div>
        <div className="admin-stat-card card">
          <span><FiShoppingBag /> Total Orders</span>
          <strong>{loading ? '—' : overview?.totalOrders}</strong>
        </div>
        <div className="admin-stat-card card">
          <span><FiTrendingUp /> Avg Order Value</span>
          <strong>{loading ? '—' : `$${overview?.averageOrderValue}`}</strong>
        </div>
        <div className="admin-stat-card card">
          <span><FiPackage /> Products</span>
          <strong>{loading ? '—' : overview?.totalProducts}</strong>
          <Link to="/admin/products">Manage →</Link>
        </div>
        <div className="admin-stat-card card">
          <span><FiUsers /> Customers</span>
          <strong>{loading ? '—' : overview?.totalUsers}</strong>
        </div>
        <div className="admin-stat-card card">
          <span>Categories</span>
          <strong>{loading ? '—' : overview?.totalCategories}</strong>
          <Link to="/admin/categories">Manage →</Link>
        </div>
      </div>

      <div className="admin-analytics-grid">
        <section className="card admin-analytics-section">
          <h2>Top Selling Products</h2>
          {loading ? (
            <p className="admin-table-empty">Loading...</p>
          ) : analytics?.topSellingProducts?.length ? (
            <div className="admin-bar-list">
              {analytics.topSellingProducts.map((item) => {
                const max = analytics.topSellingProducts[0]?.unitsSold || 1;
                return (
                  <div key={item.id} className="admin-bar-item">
                    <div className="admin-bar-label">
                      <span>{item.title}</span>
                      <strong>{item.unitsSold} sold · ${item.revenue.toFixed(0)}</strong>
                    </div>
                    <div className="admin-bar-track">
                      <div className="admin-bar-fill" style={{ width: `${(item.unitsSold / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="admin-table-empty">No sales data yet.</p>
          )}
        </section>

        <section className="card admin-analytics-section">
          <h2><FiStar /> Top Rated Products</h2>
          {loading ? (
            <p className="admin-table-empty">Loading...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topRatedProducts?.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>★ {product.rating}</td>
                    <td>{product.salesCount} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card admin-analytics-section">
          <h2>Sales by Category</h2>
          {loading ? (
            <p className="admin-table-empty">Loading...</p>
          ) : analytics?.salesByCategory?.length ? (
            <div className="admin-bar-list">
              {analytics.salesByCategory.map((item) => {
                const max = analytics.salesByCategory[0]?.revenue || 1;
                return (
                  <div key={item.category} className="admin-bar-item">
                    <div className="admin-bar-label">
                      <span>{item.category}</span>
                      <strong>${item.revenue.toFixed(0)} · {item.unitsSold} units</strong>
                    </div>
                    <div className="admin-bar-track">
                      <div className="admin-bar-fill category" style={{ width: `${(item.revenue / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="admin-table-empty">No category sales yet.</p>
          )}
        </section>

        <section className="card admin-analytics-section">
          <h2>Low Stock Alert</h2>
          {loading ? (
            <p className="admin-table-empty">Loading...</p>
          ) : analytics?.lowStockProducts?.length ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {analytics.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td className={product.stock === 0 ? 'admin-stock-critical' : 'admin-stock-low'}>{product.stock}</td>
                    <td>{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-table-empty">All products are well stocked.</p>
          )}
        </section>
      </div>

      <section className="card admin-analytics-section" style={{ marginTop: '1rem' }}>
        <h2>Recent Orders</h2>
        {loading ? (
          <p className="admin-table-empty">Loading...</p>
        ) : analytics?.recentOrders?.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(-6)}</td>
                  <td>{order.itemCount}</td>
                  <td>${order.total}</td>
                  <td><span className="admin-status-badge">{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="admin-table-empty">No orders yet.</p>
        )}
      </section>
    </div>
  );
}
