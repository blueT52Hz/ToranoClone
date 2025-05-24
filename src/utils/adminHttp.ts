import axios from "axios";
import { useAdminAuthStore } from "@/store/admin/authStore";
const adminHttp = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/admin",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

adminHttp.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().adminToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminHttp;
