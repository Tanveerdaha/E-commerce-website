import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { apiDelete, apiGet, apiPost, apiPut } from '../../services/api';
import { useAdmin } from '../../context/AdminContext';
import ImagePicker from '../../components/admin/ImagePicker';

const emptyForm = {
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  discount: '0',
  rating: '0',
  stock: '0',
  images: [],
};

export default function AdminProducts() {
  const { token } = useAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiGet('/admin/products', token),
        apiGet('/admin/categories', token),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category: categories[0]?.name || '',
    });
    setShowForm(true);
    setMessage('');
    setError('');
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: String(product.price),
      discount: String(product.discount ?? 0),
      rating: String(product.rating ?? 0),
      stock: String(product.stock ?? 0),
      images: product.images || [],
    });
    setShowForm(true);
    setMessage('');
    setError('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.images.length) {
      setError('Please add at least one product image');
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      discount: Number(form.discount),
      rating: Number(form.rating),
      stock: Number(form.stock),
      images: form.images,
    };

    try {
      if (editingId) {
        await apiPut(`/admin/products/${editingId}`, payload, token);
        setMessage('Product updated successfully');
      } else {
        await apiPost('/admin/products', payload, token);
        setMessage('Product created successfully');
      }
      closeForm();
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await apiDelete(`/admin/products/${id}`, token);
      setMessage('Product deleted');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>Add, edit, or remove store products.</p>
        </div>
        <button type="button" className="btn admin-primary-btn" onClick={openCreate}>
          <FiPlus /> Add Product
        </button>
      </header>

      {message && <p className="admin-success">{message}</p>}
      {error && <p className="admin-error">{error}</p>}

      {showForm && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal card">
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button type="button" className="admin-icon-btn" onClick={closeForm}><FiX /></button>
            </div>
            <form className="admin-form admin-form-grid" onSubmit={handleSubmit}>
              <label>
                Title
                <input value={form.title} onChange={handleChange('title')} required />
              </label>
              <label>
                Brand
                <input value={form.brand} onChange={handleChange('brand')} required />
              </label>
              <label className="admin-form-full">
                Description
                <textarea value={form.description} onChange={handleChange('description')} rows={3} required />
              </label>
              <label>
                Category
                <select value={form.category} onChange={handleChange('category')} required>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Price ($)
                <input type="number" min="0" step="0.01" value={form.price} onChange={handleChange('price')} required />
              </label>
              <label>
                Discount (%)
                <input type="number" min="0" max="100" value={form.discount} onChange={handleChange('discount')} />
              </label>
              <label>
                Rating
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange('rating')} />
              </label>
              <label>
                Stock
                <input type="number" min="0" value={form.stock} onChange={handleChange('stock')} />
              </label>
              <div className="admin-form-full">
                <ImagePicker
                  label="Product Images"
                  multiple
                  value={form.images}
                  onChange={(images) => setForm((prev) => ({ ...prev, images }))}
                />
              </div>
              <div className="admin-form-actions admin-form-full">
                <button type="button" className="btn admin-secondary-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn admin-primary-btn">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap card">
        {loading ? (
          <p className="admin-table-empty">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="admin-table-empty">No products yet. Add your first product.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sales</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={product.images?.[0]} alt={product.title} />
                      <div>
                        <strong>{product.title}</strong>
                        <span>{product.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.salesCount ?? 0}</td>
                  <td>★ {product.rating}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-icon-btn" onClick={() => openEdit(product)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button type="button" className="admin-icon-btn danger" onClick={() => handleDelete(product.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
