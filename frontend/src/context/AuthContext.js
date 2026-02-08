// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    console.log('📦 Request data:', config.data);
    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('📥 API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for auth token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          const response = await api.get('/auth/me');
          const userData = response.data.user || response.data;
          setUser(userData);
          setToken(savedToken);
          console.log('✅ Auth check successful:', userData.email);
        } catch (error) {
          console.error('❌ Auth check failed:', error.response?.status);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      console.log('🔄 Starting registration process...');
      
      // Validate data before sending
      if (!userData.fullName || !userData.email || !userData.password || !userData.phone || userData.age === undefined) {
        throw new Error('Missing required fields');
      }

      // Ensure age is a number
      const registrationData = {
        ...userData,
        age: parseInt(userData.age, 10),
        email: userData.email.toLowerCase().trim()
      };

      console.log('📤 Sending registration data:', { ...registrationData, password: '***' });

      const response = await api.post('/auth/register', registrationData);

      console.log('✅ Registration successful!');

      const { token: newToken, user: newUser } = response.data;

      // Save token and update state
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      setUser(newUser);

      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      console.log('🔄 Starting login process...');

      const loginData = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      };

      const response = await api.post('/auth/login', loginData);

      console.log('✅ Login successful!');

      const { token: newToken, user: newUser } = response.data;

      // Save token and update state
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      setUser(newUser);

      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    token,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;