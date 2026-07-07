import { useState } from 'react';
import { FiLink, FiTrash2, FiUpload } from 'react-icons/fi';
import { apiUpload } from '../../services/api';
import { useAdmin } from '../../context/AdminContext';

export default function ImagePicker({ label, value, onChange, multiple = false }) {
  const { token } = useAdmin();
  const [mode, setMode] = useState('upload');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const images = multiple ? (value || []) : (value ? [value] : []);

  const emitChange = (nextImages) => {
    if (multiple) {
      onChange(nextImages);
    } else {
      onChange(nextImages[0] || '');
    }
  };

  const addImage = (url) => {
    const trimmed = url.trim();
    if (!trimmed) return;

    if (multiple) {
      if (!images.includes(trimmed)) {
        emitChange([...images, trimmed]);
      }
    } else {
      emitChange([trimmed]);
    }
    setUrlInput('');
    setError('');
  };

  const removeImage = (index) => {
    emitChange(images.filter((_, i) => i !== index));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const data = await apiUpload('/admin/upload', file, token);
      addImage(data.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="admin-image-picker">
      {label && <span className="admin-image-picker-label">{label}</span>}

      <div className="admin-image-mode-tabs">
        <button
          type="button"
          className={mode === 'upload' ? 'active' : ''}
          onClick={() => setMode('upload')}
        >
          <FiUpload /> Upload
        </button>
        <button
          type="button"
          className={mode === 'url' ? 'active' : ''}
          onClick={() => setMode('url')}
        >
          <FiLink /> Image URL
        </button>
      </div>

      {mode === 'upload' ? (
        <label className="admin-upload-zone">
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} hidden />
          <FiUpload />
          <span>{uploading ? 'Uploading...' : 'Click to upload an image (max 5MB)'}</span>
        </label>
      ) : (
        <div className="admin-url-row">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <button type="button" className="btn admin-secondary-btn" onClick={() => addImage(urlInput)}>
            Add
          </button>
        </div>
      )}

      {error && <p className="admin-error" style={{ margin: '0.5rem 0 0' }}>{error}</p>}

      {images.length > 0 && (
        <div className="admin-image-previews">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="admin-image-preview">
              <img src={url} alt={`Preview ${index + 1}`} />
              <button type="button" className="admin-image-remove" onClick={() => removeImage(index)} title="Remove">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
