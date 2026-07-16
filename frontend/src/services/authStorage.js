export const USER_AUTH_KEYS = {
  access: 'northstar-token',
  refresh: 'northstar-refresh-token',
  user: 'northstar-user',
};

export const ADMIN_AUTH_KEYS = {
  access: 'northstar-admin-token',
  refresh: 'northstar-admin-refresh-token',
  user: 'northstar-admin-user',
};

const listeners = new Set();

export function subscribeAuthChanges(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(session, auth) {
  listeners.forEach((listener) => listener(session, auth));
}

function readUser(keys) {
  const raw = localStorage.getItem(keys.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredSession(keys) {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(keys.access);
  const refreshToken = localStorage.getItem(keys.refresh);
  const user = readUser(keys);
  if (!token || !user) return null;
  return { token, refreshToken, user };
}

export function persistSession(keys, { accessToken, refreshToken, user }) {
  localStorage.setItem(keys.access, accessToken);
  if (refreshToken) {
    localStorage.setItem(keys.refresh, refreshToken);
  }
  localStorage.setItem(keys.user, JSON.stringify(user));
}

export function clearSession(keys) {
  localStorage.removeItem(keys.access);
  localStorage.removeItem(keys.refresh);
  localStorage.removeItem(keys.user);
}

export function resolveSessionFromToken(accessToken) {
  if (!accessToken || typeof window === 'undefined') return null;
  if (localStorage.getItem(USER_AUTH_KEYS.access) === accessToken) return 'user';
  if (localStorage.getItem(ADMIN_AUTH_KEYS.access) === accessToken) return 'admin';
  return null;
}

export function getKeysForSession(session) {
  return session === 'admin' ? ADMIN_AUTH_KEYS : USER_AUTH_KEYS;
}

export function updateAccessTokens(session, { accessToken, refreshToken }) {
  const keys = getKeysForSession(session);
  localStorage.setItem(keys.access, accessToken);
  if (refreshToken) {
    localStorage.setItem(keys.refresh, refreshToken);
  }
  const user = readUser(keys);
  notify(session, user ? { token: accessToken, refreshToken: refreshToken || localStorage.getItem(keys.refresh), user } : null);
}

export function clearAuthSession(session) {
  clearSession(getKeysForSession(session));
  notify(session, null);
}

export function saveAuthSession(session, data) {
  const accessToken = data.accessToken || data.token;
  const refreshToken = data.refreshToken;
  const { user } = data;
  persistSession(getKeysForSession(session), { accessToken, refreshToken, user });
  notify(session, { token: accessToken, refreshToken, user });
  return { token: accessToken, refreshToken, user };
}
