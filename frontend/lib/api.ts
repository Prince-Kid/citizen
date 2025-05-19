import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
