import { AuthResponse } from "@/types/auth.type";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";
import adminHttp from "@/utils/adminHttp";

export const authApi = {
  login(body: { admin_username: string; admin_password: string }) {
    return adminHttp.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, body);
  },
};
