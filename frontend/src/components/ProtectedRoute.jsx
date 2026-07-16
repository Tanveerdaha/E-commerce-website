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
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(returnTo)}`}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
