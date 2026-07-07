import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const { admin, login, loading } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  if (admin?.token) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      setMessage('');
      navigate('/admin');
    } catch (error) {
      setMessage(error.message || 'Login failed');
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card card">
        <div className="admin-login-header">
          <span className="admin-brand-mark">N</span>
          <div>
            <h1>Admin Login</h1>
            <p>Sign in to manage products and categories.</p>
          </div>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </label>
          {message && <p className="admin-error">{message}</p>}
          <button type="submit" className="btn admin-primary-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}
