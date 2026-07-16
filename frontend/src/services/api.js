import {
  ADMIN_AUTH_KEYS,
  USER_AUTH_KEYS,
  clearAuthSession,
  getKeysForSession,
  resolveSessionFromToken,
  updateAccessTokens,
} from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const AUTH_SKIP_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/admin/login',
  '/auth/refresh',
];

let refreshPromises = {};

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function shouldSkipRefresh(path) {
  return AUTH_SKIP_REFRESH_PATHS.some((skipPath) => path.startsWith(skipPath));
}

function redirectToLogin(session) {
  if (typeof window === 'undefined') return;
  const target = session === 'admin' ? '/admin/login' : '/login';
  const { pathname, search } = window.location;
  if (pathname === target || pathname.startsWith(`${target}?`)) return;

  if (session === 'admin') {
    window.location.assign(target);
    return;
  }

  const redirect = encodeURIComponent(`${pathname}${search}`);
  window.location.assign(`${target}?redirect=${redirect}`);
}

async function requestRefresh(refreshToken) {
  const response = await fetch(buildUrl('/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || 'Refresh failed', response.status);
  }

  return data;
}

async function refreshSession(session) {
  if (!refreshPromises[session]) {
    refreshPromises[session] = (async () => {
      const keys = getKeysForSession(session);
      const refreshToken = localStorage.getItem(keys.refresh);

      if (!refreshToken) {
        clearAuthSession(session);
        redirectToLogin(session);
        throw new ApiError('Refresh token unavailable', 401);
      }

      try {
        const data = await requestRefresh(refreshToken);
        const accessToken = data.accessToken || data.token;
        updateAccessTokens(session, {
          accessToken,
          refreshToken: data.refreshToken,
        });
        return accessToken;
      } catch (error) {
        clearAuthSession(session);
        redirectToLogin(session);
        throw error;
      }
    })().finally(() => {
      delete refreshPromises[session];
    });
  }

  return refreshPromises[session];
}

async function parseResponse(response) {
  return response.json().catch(() => ({}));
}

async function apiRequest(path, options = {}, token = null, allowRefresh = true) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: options.body instanceof FormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  const data = await parseResponse(response);

  if (response.status === 401 && allowRefresh && token && !shouldSkipRefresh(path)) {
    const session = resolveSessionFromToken(token)
      || (path.startsWith('/admin') ? 'admin' : 'user');

    const keys = session === 'admin' ? ADMIN_AUTH_KEYS : USER_AUTH_KEYS;
    if (!localStorage.getItem(keys.refresh)) {
      clearAuthSession(session);
      redirectToLogin(session);
      throw new ApiError(data.message || 'Authentication required', 401);
    }

    const nextAccessToken = await refreshSession(session);
    return apiRequest(path, options, nextAccessToken, false);
  }

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return data;
}

export async function apiUpload(path, file, token) {
  const formData = new FormData();
  formData.append('image', file);

  return apiRequest(path, { method: 'POST', body: formData }, token);
}

export const apiGet = (path, token) => apiRequest(path, { method: 'GET' }, token);
export const apiPost = (path, body, token) => apiRequest(path, { method: 'POST', body }, token);
export const apiPut = (path, body, token) => apiRequest(path, { method: 'PUT', body }, token);
export const apiDelete = (path, token) => apiRequest(path, { method: 'DELETE' }, token);
