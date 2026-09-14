import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hms_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => setUser(res.data.data.user))
        .catch(() => {
          localStorage.removeItem('hms_token');
          localStorage.removeItem('hms_user');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: t, data } = res.data;
      localStorage.setItem('hms_token', t);
      localStorage.setItem('hms_user', JSON.stringify(data.user));
      setToken(t);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    setToken(null);
    setUser(null);
    toast.info('Logged out');
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      toast.success(`User ${res.data.data.user.name} created`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await API.put('/auth/profile', profileData);
      setUser(res.data.data.user);
      localStorage.setItem('hms_user', JSON.stringify(res.data.data.user));
      toast.success('Profile updated');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await API.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token && !!user, login, logout, register, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};