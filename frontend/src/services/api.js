const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export async function apiRequest(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function apiUpload(path, file, token) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }

  return data;
}

export const apiGet = (path, token) => apiRequest(path, { method: 'GET' }, token);
export const apiPost = (path, body, token) => apiRequest(path, { method: 'POST', body }, token);
export const apiPut = (path, body, token) => apiRequest(path, { method: 'PUT', body }, token);
export const apiDelete = (path, token) => apiRequest(path, { method: 'DELETE' }, token);
