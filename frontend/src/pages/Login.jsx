import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Login() {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // client-side validation for register
      if (isRegister) {
        if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
          setMessage('Email must be a gmail.com address');
          return;
        }

        if (password.length < 8) {
          setMessage('Password must be at least 8 characters');
          return;
        }
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      setMessage('');
      navigate('/');
    } catch (error) {
      setMessage(error.message || 'Authentication failed');
    }
  };

  return (
    <main className="container" style={{ padding: '3rem 0', display: 'grid', placeItems: 'center' }}>
      <div className="card" style={{ width: 'min(420px, 100%)', padding: '2rem' }}>
        <h1 style={{ marginTop: 0 }}>{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <p style={{ color: '#64748b' }}>Sign in or create an account to sync your cart and wishlist.</p>
        <form style={{ display: 'grid', gap: '0.9rem' }} onSubmit={handleSubmit}>
          {isRegister && (
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" style={{ padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }} />
          )}
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" style={{ padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }} />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" style={{ padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }} />
          {message && <p style={{ color: '#dc2626', margin: 0 }}>{message}</p>}
          <button className="btn" style={{ background: '#2563eb', color: 'white' }}>{isRegister ? 'Create Account' : 'Log In'}</button>
          <button type="button" className="btn" onClick={() => setIsRegister((value) => !value)} style={{ background: '#f8fafc', color: '#334155' }}>
            {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </form>
      </div>
    </main>
  );
}
