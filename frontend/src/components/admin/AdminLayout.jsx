import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiBox, FiGrid, FiHome, FiLogOut, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/categories', label: 'Categories', icon: FiGrid },
];

export default function AdminLayout() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">N</span>
          <div>
            <strong>Northstar</strong>
            <p>Admin Panel</p>
          </div>
        </div>
        <nav className="admin-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <p>{admin?.user?.name}</p>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
