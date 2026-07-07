import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { apiDelete, apiGet, apiPost, apiPut } from '../../services/api';
import { useAdmin } from '../../context/AdminContext';
import ImagePicker from '../../components/admin/ImagePicker';

const emptyForm = { name: '', description: '', image: '' };

export default function AdminCategories() {
  const { token } = useAdmin();
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
      const data = await apiGet('/admin/categories', token);
      setCategories(data.categories || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage('');
    setError('');
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await apiPut(`/admin/categories/${editingId}`, form, token);
        setMessage('Category updated successfully');
      } else {
        await apiPost('/admin/categories', form, token);
        setMessage('Category created successfully');
      }
      closeForm();
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await apiDelete(`/admin/categories/${id}`, token);
      setMessage('Category deleted');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p>Organize products into categories.</p>
        </div>
        <button type="button" className="btn admin-primary-btn" onClick={openCreate}>
          <FiPlus /> Add Category
        </button>
      </header>

      {message && <p className="admin-success">{message}</p>}
      {error && <p className="admin-error">{error}</p>}

      {showForm && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal card">
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button type="button" className="admin-icon-btn" onClick={closeForm}><FiX /></button>
            </div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </label>
              <ImagePicker
                label="Category Image"
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
              />
              <div className="admin-form-actions">
                <button type="button" className="btn admin-secondary-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn admin-primary-btn">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap card">
        {loading ? (
          <p className="admin-table-empty">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="admin-table-empty">No categories yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="admin-category-thumb" />
                    ) : (
                      <span className="admin-no-image">No image</span>
                    )}
                  </td>
                  <td><strong>{category.name}</strong></td>
                  <td>{category.slug}</td>
                  <td>{category.description || '—'}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-icon-btn" onClick={() => openEdit(category)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button type="button" className="admin-icon-btn danger" onClick={() => handleDelete(category.id)} title="Delete">
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
