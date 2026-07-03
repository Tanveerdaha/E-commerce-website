export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '999px', background: '#f8fafc' }}>
      <input value={value} onChange={onChange} placeholder={placeholder} style={{ border: 'none', outline: 'none', background: 'transparent', minWidth: '180px' }} />
    </div>
  );
}
