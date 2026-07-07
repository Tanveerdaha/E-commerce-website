import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="store-footer">
      <div className="container store-footer-grid">
        <div>
          <h3>Northstar</h3>
          <p>Minimal luxury essentials for modern life.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <p><Link to="/products">Shop</Link></p>
          <p><Link to="/about">About</Link></p>
          <p><Link to="/support">Support</Link></p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>hello@northstar.com</p>
          <p>+92 3123456789</p>
        </div>
      </div>
    </footer>
  );
}
