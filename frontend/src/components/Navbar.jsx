import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Wishlist', path: '/wishlist' },
  { name: 'Orders', path: '/orders', authOnly: true },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { setIsCartOpen, auth, logout, searchQuery, setSearchQuery } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setMenuOpen(false);
    navigate('/products');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="store-header">
      <div className="container">
        <nav className="store-nav card">
          <Link to="/" className="store-logo" onClick={closeMenu}>Northstar</Link>

          <form className="store-search store-search-mobile" onSubmit={handleSearchSubmit}>
            <FiSearch color="#64748b" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search products"
            />
          </form>

          <button
            type="button"
            className="store-nav-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          {menuOpen && (
            <button type="button" className="store-nav-overlay" onClick={closeMenu} aria-label="Close menu" />
          )}

          <div className={`store-nav-panel${menuOpen ? ' open' : ''}`}>
            <div className="store-nav-top-mobile">
              <strong>Menu</strong>
              <button type="button" className="store-nav-toggle" onClick={closeMenu} aria-label="Close menu">
                <FiX size={20} />
              </button>
            </div>

            <form className="store-search store-search-desktop" onSubmit={handleSearchSubmit}>
              <FiSearch color="#64748b" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
              />
            </form>

            <div className="store-nav-links">
              {navItems.filter((item) => !item.authOnly || auth).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `store-nav-link${isActive ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="store-nav-actions">
              <button
                type="button"
                className="store-icon-btn cart"
                onClick={() => { setIsCartOpen(true); closeMenu(); }}
                aria-label="Open cart"
              >
                <FiShoppingBag size={18} />
                <span className="store-icon-btn-label">Cart</span>
              </button>
              <Link to="/wishlist" className="store-icon-btn wishlist" onClick={closeMenu} aria-label="Wishlist">
                <FiHeart size={18} />
                <span className="store-icon-btn-label">Wishlist</span>
              </Link>
              {auth ? (
                <button type="button" className="store-icon-btn logout" onClick={() => { logout(); closeMenu(); }}>
                  Logout
                </button>
              ) : (
                <Link to="/login" className="store-icon-btn login" onClick={closeMenu}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
