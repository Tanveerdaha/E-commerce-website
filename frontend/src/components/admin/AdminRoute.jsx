import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export default function AdminRoute() {
  const { admin } = useAdmin();
  const location = useLocation();

  if (!admin?.token) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/admin/login?redirect=${encodeURIComponent(returnTo)}`}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
