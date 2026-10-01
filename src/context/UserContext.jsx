// src/context/UserContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import authService from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';
import { setTokenGetter } from '../services/api';

const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [error, setError] = useState(null);
  const bootstrapped = useRef(false);

  // Give the api client a way to read the current access token
  useEffect(() => {
    setTokenGetter(() => tokenStorage.getAccessToken());
  }, []);

  // On mount: try to restore the session
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const restore = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        setStatus('unauthenticated');
        return;
      }

      try {
        // If we have an access token, try /me directly
        if (accessToken) {
          const me = await authService.me();
          setUser(me);
          setStatus('authenticated');
          return;
        }
        // Otherwise attempt a refresh
        const session = await authService.refresh();
        setUser(session.user);
        setStatus('authenticated');
      } catch {
        tokenStorage.clear();
        setUser(null);
        setStatus('unauthenticated');
      }
    };

    restore();
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const session = await authService.login(credentials);
      setUser(session.user);
      setStatus('authenticated');
      return session.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    try {
      const session = await authService.register(payload);
      setUser(session.user);
      setStatus('authenticated');
      return session.user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login,
      register,
      logout,
    }),
    [user, status, error, login, register, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};