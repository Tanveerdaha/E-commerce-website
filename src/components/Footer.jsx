export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#e2e8f0', padding: '3rem 0', marginTop: '3rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3 style={{ color: 'white', marginBottom: '0.75rem' }}>Northstar</h3>
          <p style={{ opacity: 0.8 }}>Minimal luxury essentials for modern life.</p>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '0.75rem' }}>Quick Links</h4>
          <p>Shop</p>
          <p>About</p>
          <p>Support</p>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '0.75rem' }}>Contact</h4>
          <p>hello@northstar.com</p>
          <p>+92 3123456789</p>
        </div>
      </div>
    </footer>
  );
}
