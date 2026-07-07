import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { apiGet } from '../services/api';

export default function Products() {
  const { products, loading, searchQuery, setSearchQuery } = useStore();
  const [search, setSearch] = useState(searchQuery);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiGet('/categories')
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const effectiveSearch = searchQuery || search;

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(effectiveSearch.toLowerCase()) || product.description.toLowerCase().includes(effectiveSearch.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return b.discount - a.discount;
    });

    return sorted;
  }, [effectiveSearch, category, sort, products]);

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>Products</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input value={search} onChange={(e) => {
            setSearch(e.target.value);
            setSearchQuery(e.target.value);
          }} placeholder="Search products" style={{ padding: '0.75rem 1rem', borderRadius: '999px', border: '1px solid #e2e8f0' }} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '999px', border: '1px solid #e2e8f0' }}>
            <option>All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '999px', border: '1px solid #e2e8f0' }}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </main>
  );
}
