import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken, setUnauthorizedHandler } from '../routes/api';
import { getMeRequest, loginRequest, registerRequest } from '../routes/authService';
import { clearPaymentSuccessCartClearPending, clearPersistedCartStorage } from '../utils/cartPersistence';
import { AuthContext } from './authContextValue';

const USER_STORAGE_KEY = 'rolling-commerce-user';

const readStoredSession = () => {
  try {
    const storedToken = getStoredToken();
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedToken || !storedUser) {
      clearStoredToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      return { user: null, token: null };
    }

    return {
      user: JSON.parse(storedUser),
      token: storedToken,
    };
  } catch {
    clearStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    return { user: null, token: null };
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [loading, setLoading] = useState(() => Boolean(getStoredToken() && localStorage.getItem(USER_STORAGE_KEY)));
  const [error, setError] = useState(null);
  const [sessionVerified, setSessionVerified] = useState(
    () => !(getStoredToken() && localStorage.getItem(USER_STORAGE_KEY)),
  );

  const clearSession = useCallback(() => {
    clearStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    clearPersistedCartStorage();
    clearPaymentSuccessCartClearPending();
    setSession({ user: null, token: null });
    setSessionVerified(true);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setError(null);
    setLoading(false);
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    let ignore = false;

    const revalidateSession = async () => {
      if (!session.token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const user = await getMeRequest();
        if (ignore) return;

        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        setSession({ user, token: session.token });
        setSessionVerified(true);
        setError(null);
      } catch (requestError) {
        if (ignore) return;

        if (requestError.status === 401) {
          logout();
        } else {
          setSessionVerified(false);
          setError(requestError.message || 'No pudimos validar la sesion.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    revalidateSession();

    return () => {
      ignore = true;
    };
  }, [logout, session.token]);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginRequest(credentials);
      setStoredToken(data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      setSession({ user: data.user, token: data.token });
      setSessionVerified(true);
      return data.user;
    } catch (requestError) {
      setError(requestError.message || 'No pudimos iniciar sesión.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      return await registerRequest(formData);
    } catch (requestError) {
      setError(requestError.message || 'No pudimos crear la cuenta.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      loading,
      error,
      isAuthenticated: Boolean(session.user && session.token && sessionVerified),
      isAdmin: Boolean(sessionVerified && session.user?.role === 'admin'),
      login,
      register,
      logout,
    }),
    [session, loading, error, sessionVerified, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
