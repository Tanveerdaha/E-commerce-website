import { Link, NavLink } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiMenu, FiSearch } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Wishlist', path: '/wishlist' },
  { name: 'Login', path: '/login' },
];

export default function Navbar() {
  const { cart, wishlist, setIsCartOpen } = useStore();

  return (
    <header className="container" style={{ padding: '1rem 0' }}>
      <nav className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '999px' }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2563eb' }}>Northstar</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '999px', background: '#f8fafc' }}>
            <FiSearch color="#64748b" />
            <input placeholder="Search" style={{ border: 'none', outline: 'none', background: 'transparent', minWidth: '180px' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} style={({ isActive }) => ({ padding: '0.6rem 0.9rem', borderRadius: '999px', color: isActive ? '#2563eb' : '#334155', fontWeight: 600 })}>
                {item.name}
              </NavLink>
            ))}
          </div>
          <button className="btn" style={{ background: '#fff7ed', color: '#c2410c', padding: '0.7rem' }} onClick={() => setIsCartOpen(true)}>
            <FiShoppingBag size={18} />
            <span style={{ marginLeft: '0.35rem' }}>{cart.length}</span>
          </button>
          <Link to="/wishlist" className="btn" style={{ background: '#eff6ff', color: '#2563eb', padding: '0.7rem' }}>
            <FiHeart size={18} />
            <span style={{ marginLeft: '0.35rem' }}>{wishlist.length}</span>
          </Link>
          <button className="btn" style={{ background: '#f8fafc', color: '#334155', padding: '0.7rem' }}>
            <FiMenu size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
}
