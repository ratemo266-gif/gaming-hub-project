// src/services/api.js

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

/**
 * Custom error class so callers can check status codes.
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieve the current access token (from memory or storage).
 * Kept as a pluggable function so we can swap storage strategies.
 */
let tokenGetter = () => null;
export const setTokenGetter = (fn) => {
  tokenGetter = fn;
};

/**
 * Core request function.
 */
async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    signal,
    ...rest
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const finalHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  // Only attach Content-Type when there is a body
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  // Attach bearer token when required
  if (auth) {
    const token = tokenGetter();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body:
        body instanceof FormData
          ? body
          : body !== undefined
          ? JSON.stringify(body)
          : undefined,
      signal,
      ...rest,
    });
  } catch (networkErr) {
    throw new ApiError(
      'Network error — please check your connection.',
      0,
      null
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

// Convenience helpers
export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;