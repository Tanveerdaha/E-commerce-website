import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Login() {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
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
      navigate(redirect);
    } catch (error) {
      setMessage(error.message || 'Authentication failed');
    }
  };

  return (
    <main className="container auth-page">
      <div className="card auth-card">
        <h1>{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <p>Sign in or create an account to sync your cart and wishlist.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required />
          )}
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
          {message && <p className="auth-error">{message}</p>}
          <button type="submit" className="btn auth-submit">{isRegister ? 'Create Account' : 'Log In'}</button>
          <button type="button" className="btn auth-toggle" onClick={() => setIsRegister((value) => !value)}>
            {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </form>
      </div>
    </main>
  );
}
