export default function Login() {
  return (
    <main className="container" style={{ padding: '3rem 0', display: 'grid', placeItems: 'center' }}>
      <div className="card" style={{ width: 'min(420px, 100%)', padding: '2rem' }}>
        <h1 style={{ marginTop: 0 }}>Welcome back</h1>
        <p style={{ color: '#64748b' }}>Sign in to continue your premium shopping experience.</p>
        <form style={{ display: 'grid', gap: '0.9rem' }}>
          <input type="email" placeholder="Email" style={{ padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }} />
          <input type="password" placeholder="Password" style={{ padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }} />
          <button className="btn" style={{ background: '#2563eb', color: 'white' }}>Log In</button>
          <button className="btn" style={{ background: '#f8fafc', color: '#334155' }}>Continue with Google</button>
        </form>
      </div>
    </main>
  );
}
