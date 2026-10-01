// src/services/tokenStorage.js

const ACCESS_TOKEN_KEY = 'gamehub.accessToken';
const REFRESH_TOKEN_KEY = 'gamehub.refreshToken';

export const tokenStorage = {
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token) {
    if (token) sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    else sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token) {
    if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
    else localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clear() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};