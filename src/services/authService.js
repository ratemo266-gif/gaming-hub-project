// src/services/authService.js

import api, { ApiError } from './api';
import { tokenStorage } from './tokenStorage';

// Toggle mock mode via env: REACT_APP_USE_MOCK_AUTH=true
const USE_MOCK = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

// ---------------------------------------------------------------------------
// Mock backend (in-memory) — for local dev without a server
// ---------------------------------------------------------------------------

const MOCK_USERS = [
  {
    id: 'u_1',
    username: 'GameMaster42',
    email: 'gamemaster@example.com',
    // NOTE: never store plaintext passwords in real code — this is mock only
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GameMaster42',
    level: 42,
    xp: 7850,
    xpToNext: 10000,
    gamesOwned: 24,
    achievements: 156,
    friends: 89,
    joinDate: '2023-01-15',
    favoriteGenres: ['RPG', 'Action', 'Strategy'],
    recentGames: [
      { id: 1, name: 'Cyber Odyssey', hoursPlayed: 45, lastPlayed: '2 hours ago' },
      { id: 2, name: 'Dragon Realm', hoursPlayed: 120, lastPlayed: 'Yesterday' },
      { id: 3, name: 'Space Warriors', hoursPlayed: 67, lastPlayed: '3 days ago' },
    ],
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const mockRegister = async ({ username, email, password }) => {
  await delay(600);
  if (MOCK_USERS.some((u) => u.email === email)) {
    throw new ApiError('Email already registered.', 409);
  }
  if (MOCK_USERS.some((u) => u.username === username)) {
    throw new ApiError('Username already taken.', 409);
  }

  const newUser = {
    id: `u_${Date.now()}`,
    username,
    email,
    password,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      username
    )}`,
    level: 1,
    xp: 0,
    xpToNext: 1000,
    gamesOwned: 0,
    achievements: 0,
    friends: 0,
    joinDate: new Date().toISOString().slice(0, 10),
    favoriteGenres: [],
    recentGames: [],
  };
  MOCK_USERS.push(newUser);

  return buildMockSession(newUser);
};

const mockLogin = async ({ email, password }) => {
  await delay(600);
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user || user.password !== password) {
    throw new ApiError('Invalid email or password.', 401);
  }
  return buildMockSession(user);
};

const mockRefresh = async (refreshToken) => {
  await delay(200);
  if (!refreshToken || !refreshToken.startsWith('mock-refresh-')) {
    throw new ApiError('Invalid refresh token.', 401);
  }
  const userId = refreshToken.replace('mock-refresh-', '');
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) throw new ApiError('User not found.', 401);

  return {
    accessToken: `mock-access-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-${user.id}`,
    user: sanitizeUser(user),
  };
};

const mockMe = async (accessToken) => {
  await delay(200);
  if (!accessToken || !accessToken.startsWith('mock-access-')) {
    throw new ApiError('Unauthorized.', 401);
  }
  const userId = accessToken.split('-')[2];
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) throw new ApiError('User not found.', 404);
  return sanitizeUser(user);
};

const mockLogout = async () => {
  await delay(150);
  return { success: true };
};

const buildMockSession = (user) => ({
  accessToken: `mock-access-${user.id}-${Date.now()}`,
  refreshToken: `mock-refresh-${user.id}`,
  user: sanitizeUser(user),
});

const sanitizeUser = ({ password, ...safe }) => safe;

// ---------------------------------------------------------------------------
// Public API — same shape whether mock or real
// ---------------------------------------------------------------------------

export const authService = {
  /**
   * Register a new user.
   * @returns {Promise<{accessToken, refreshToken, user}>}
   */
  async register({ username, email, password }) {
    if (USE_MOCK) return mockRegister({ username, email, password });

    const data = await api.post(
      '/auth/register',
      { username, email, password },
      { auth: false }
    );
    persistSession(data);
    return data;
  },

  /**
   * Log a user in.
   * @returns {Promise<{accessToken, refreshToken, user}>}
   */
  async login({ email, password }) {
    if (USE_MOCK) return mockLogin({ email, password });

    const data = await api.post(
      '/auth/login',
      { email, password },
      { auth: false }
    );
    persistSession(data);
    return data;
  },

  /**
   * Exchange a refresh token for a new access token.
   * @returns {Promise<{accessToken, refreshToken, user}>}
   */
  async refresh() {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new ApiError('No refresh token available.', 401);

    if (USE_MOCK) {
      const data = await mockRefresh(refreshToken);
      persistSession(data);
      return data;
    }

    const data = await api.post(
      '/auth/refresh',
      { refreshToken },
      { auth: false }
    );
    persistSession(data);
    return data;
  },

  /**
   * Fetch the currently authenticated user (via access token).
   */
  async me() {
    const accessToken = tokenStorage.getAccessToken();
    if (USE_MOCK) return mockMe(accessToken);
    return api.get('/auth/me');
  },

  /**
   * Log the user out on the server and clear local storage.
   */
  async logout() {
    try {
      if (USE_MOCK) {
        await mockLogout();
      } else {
        // Fire-and-forget; ignore errors since we're logging out anyway
        await api.post('/auth/logout', {}).catch(() => {});
      }
    } finally {
      tokenStorage.clear();
    }
  },

  /**
   * Request a password reset email.
   */
  async forgotPassword(email) {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, message: 'If that email exists, we sent a link.' };
    }
    return api.post('/auth/forgot-password', { email }, { auth: false });
  },

  /**
   * Reset password using a token from the reset email.
   */
  async resetPassword({ token, password }) {
    if (USE_MOCK) {
      await delay(400);
      return { success: true };
    }
    return api.post(
      '/auth/reset-password',
      { token, password },
      { auth: false }
    );
  },
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function persistSession(data) {
  if (data?.accessToken) tokenStorage.setAccessToken(data.accessToken);
  if (data?.refreshToken) tokenStorage.setRefreshToken(data.refreshToken);
}

export default authService;