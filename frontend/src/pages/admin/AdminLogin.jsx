import { useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

function getSafeRedirect(candidate, fallback = '/admin') {
  if (!candidate || typeof candidate !== 'string') return fallback;
  if (!candidate.startsWith('/admin') || candidate.startsWith('//')) return fallback;
  if (candidate.startsWith('/admin/login')) return fallback;
  return candidate;
}

function resolveRedirect(searchParams, location) {
  const fromQuery = searchParams.get('redirect');
  if (fromQuery) return getSafeRedirect(fromQuery);

  const from = location.state?.from;
  if (from) {
    return getSafeRedirect(`${from.pathname || ''}${from.search || ''}${from.hash || ''}`);
  }

  return '/admin';
}

export default function AdminLogin() {
  const { admin, login, loading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirect(searchParams, location);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  if (admin?.token) {
    return <Navigate to={redirect} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      setMessage('');
      navigate(redirect, { replace: true });
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
