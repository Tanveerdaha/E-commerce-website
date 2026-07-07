import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import { useAdmin } from '../../context/AdminContext';

export default function AdminCustomers() {
  const { token } = useAdmin();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet('/admin/customers', token);
      setCustomers(data.customers || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load customers');
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
          <h1>Customers</h1>
          <p>Registered customers and their details.</p>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap card">
        {loading ? (
          <p className="admin-table-empty">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="admin-table-empty">No customers yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.email}</td>
                  <td>{customer.city}</td>
                  <td>{customer.orderCount}</td>
                  <td>${customer.totalSpent?.toFixed(2)}</td>
                  <td>{new Date(customer.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
