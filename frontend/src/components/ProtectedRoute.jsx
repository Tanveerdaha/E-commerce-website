import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useStore();
  const location = useLocation();

  if (loading) {
    return (
      <main className="container page-main">
        <p className="empty-state card">Loading...</p>
      </main>
    );
  }

  if (!auth?.token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
