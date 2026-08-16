import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError, tokenStore } from '../utils/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const fetchProfile = useCallback(async () => {
    const profile = await api.get('/auth/me/', undefined, { auth: true });
    setUser(profile);
    return profile;
  }, []);

  // On first load: if a refresh token survived from a previous visit,
  // silently try to turn it into a session instead of forcing a fresh
  // login every time the tab is closed and reopened.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!tokenStore.getRefresh()) {
        setBootstrapping(false);
        return;
      }
      try {
        await fetchProfile();
      } catch {
        tokenStore.clear();
        if (active) setUser(null);
      } finally {
        if (active) setBootstrapping(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchProfile]);

  const login = useCallback(
    async (email, password) => {
      const tokens = await api.post('/auth/login/', { email, password });
      tokenStore.setTokens(tokens);
      return fetchProfile();
    },
    [fetchProfile]
  );

  const register = useCallback(
    async ({ email, firstName, lastName, phone, password, passwordConfirm }) => {
      await api.post('/auth/register/', {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        password,
        password_confirm: passwordConfirm,
      });
      // Registration doesn't itself return tokens (kept as a distinct,
      // separately-throttleable endpoint on the backend) — log in right
      // after so the person isn't asked to type their password twice.
      return login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefresh();
    if (refresh) {
      // Best-effort — blacklists the refresh token server-side so it
      // can't be replayed. Don't block the UI on this succeeding.
      api.post('/auth/logout/', { refresh }).catch(() => {});
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const updated = await api.patch('/auth/me/', payload, { auth: true });
    setUser(updated);
    return updated;
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    return api.post(
      '/auth/change-password/',
      { old_password: oldPassword, new_password: newPassword },
      { auth: true }
    );
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    bootstrapping,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export { ApiError };
