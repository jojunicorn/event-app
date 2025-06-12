import axios from "axios";

const getToken = () => {
  return localStorage.getItem("token");
};

const instance = axios.create({
  baseURL: 'http://localhost:8077',
  withCredentials: true
});

instance.interceptors.request.use(
  function (config) {
    const token = getToken();

    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";

    // ✅ Skip token if request config has skipAuth = true
    if (token && !config.headers['skipAuth']) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // ✅ Clean up custom flag so it doesn't get sent to the backend
    delete config.headers['skipAuth'];

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


export default instance;
