import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careermind_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('careermind_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const meRes = await authAPI.getMe();
      const profRes = await profileAPI.getProfile();
      setUser(meRes.data);
      setProfile(profRes.data);
      localStorage.setItem('careermind_user', JSON.stringify(meRes.data));
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { access_token, user_id, name, email: userEmail } = res.data;
    
    const userData = { id: user_id, name, email: userEmail };
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('careermind_token', access_token);
    localStorage.setItem('careermind_user', JSON.stringify(userData));

    await fetchUserProfile();
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { access_token, user_id, email: userEmail } = res.data;

    const userData = { id: user_id, name, email: userEmail };
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('careermind_token', access_token);
    localStorage.setItem('careermind_user', JSON.stringify(userData));

    await fetchUserProfile();
    return userData;
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('careermind_token');
    localStorage.removeItem('careermind_user');
  };

  const updateProfileData = async (updatedData) => {
    const res = await profileAPI.updateProfile(updatedData);
    setProfile(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        register,
        logout,
        updateProfileData,
        refreshProfile: fetchUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
