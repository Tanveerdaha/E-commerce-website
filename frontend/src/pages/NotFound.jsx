import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>The page you're looking for does not exist.</p>
      <Link to="/" className="btn" style={{ background: '#2563eb', color: 'white' }}>Back Home</Link>
    </main>
  );
}
