// lib/axios.ts
import axios from "axios";

const getToken = () => {
  return localStorage.getItem("token");
};

const instance = axios.create({
  baseURL: 'http://localhost:8077',
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const token = getToken();

    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";

    if (token && !config.headers['skipAuth']) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    delete config.headers['skipAuth'];

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  error => {
    let message = "Something went wrong";

    if (error.response?.status === 401) {
      message = "Your session has expired. Please log in again.";

      // Optional: auto logout
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('global-error', {
          detail: message
        }));
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000); // Delay redirect so the user sees the message
      }

      return Promise.reject(error); // still reject to keep consistency
    }

    // Generic error handling
    if (error.response?.data) {
      const data = error.response.data;

      if (typeof data === 'string') message = data;
      else if (data.message) message = data.message;
      else if (data.error) message = data.error;
      else message = JSON.stringify(data);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('global-error', { detail: message }));
    }

    return Promise.reject(error);
  }
);


export default instance;
