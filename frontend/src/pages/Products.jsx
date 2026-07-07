import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { apiGet } from '../services/api';

export default function Products() {
  const { products, loading, searchQuery, setSearchQuery } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchQuery);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiGet('/categories')
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    setCategory(urlCategory || 'All');
  }, [searchParams]);

  const effectiveSearch = searchQuery || search;

  const handleCategoryChange = (value) => {
    setCategory(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', value);
    }
    setSearchParams(nextParams, { replace: true });
  };

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
    <main className="container page-main">
      <div className="products-toolbar">
        <h1 className="page-title">{category === 'All' ? 'Products' : category}</h1>
        <div className="products-filters">
          <input
            className="store-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search..."
            aria-label="Search products"
          />
          <select className="store-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)} aria-label="Filter by category">
            <option>All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select className="store-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="price-low">Low price</option>
            <option value="price-high">High price</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>
      <div className="grid product-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="empty-state card">No products match your filters.</p>
        ) : (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </main>
  );
}
