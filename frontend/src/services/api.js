import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});


// Add token + email to requests
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ADD EMAIL HEADER (Fix homework error)
    if (user?.email) {
      config.headers.email = user.email;
    }

    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => Promise.reject(error)
);


// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", response.status);
    return response;
  },
  (error) => {

    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


export default api;
