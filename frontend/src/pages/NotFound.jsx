import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="container not-found-page">
      <h1>404</h1>
      <p>The page you're looking for does not exist.</p>
      <Link to="/" className="btn" style={{ background: '#2563eb', color: 'white' }}>Back Home</Link>
    </main>
  );
}
