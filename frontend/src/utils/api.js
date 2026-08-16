const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const ACCESS_TOKEN_KEY = 'medicareplus_access_token';
const REFRESH_TOKEN_KEY = 'medicareplus_refresh_token';

/**
 * Access token lives in sessionStorage (cleared when the tab closes) —
 * it's short-lived (30 min, see backend SIMPLE_JWT settings) so the
 * exposure window if it ever leaked is small.
 *
 * Refresh token lives in localStorage so a "logged in" state survives
 * closing the browser, for up to REFRESH_TOKEN_LIFETIME_DAYS (7 days
 * by default). This is a reasonable default for a patient portal;
 * if you wanted a stricter "log out when the browser closes" policy,
 * move this to sessionStorage too.
 */
export const tokenStore = {
  getAccess: () => sessionStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ access, refresh }) => {
    if (access) sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Dedupes concurrent refresh attempts — if five API calls 401 at the
// same moment, they should all wait on the SAME refresh request
// rather than firing five separate ones.
let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        tokenStore.setTokens({ access: data.access, refresh: data.refresh });
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request(path, { method = 'GET', body, params, auth = false, headers = {}, _retried = false } = {}) {
  let url = `${API_BASE_URL}${path}`;

  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    if (query) url += `?${query}`;
  }

  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (auth) {
    const token = tokenStore.getAccess();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch (networkError) {
    throw new ApiError(
      'Could not reach the MediCare+ server. Is the backend running?',
      0,
      null
    );
  }

  // Access token expired mid-session — try one silent refresh-and-retry
  // before giving up, so the user isn't randomly logged out every 30
  // minutes while actively using the app.
  if (response.status === 401 && auth && !_retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request(path, { method, body, params, auth, headers, _retried: true });
    }
    tokenStore.clear();
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(data?.detail || 'Something went wrong. Please try again.', response.status, data?.errors);
  }

  return data;
}

export const api = {
  get: (path, params, options = {}) => request(path, { method: 'GET', params, ...options }),
  post: (path, body, options = {}) => request(path, { method: 'POST', body, ...options }),
  patch: (path, body, options = {}) => request(path, { method: 'PATCH', body, ...options }),
  put: (path, body, options = {}) => request(path, { method: 'PUT', body, ...options }),
  delete: (path, options = {}) => request(path, { method: 'DELETE', ...options }),
};
