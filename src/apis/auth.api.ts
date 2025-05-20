import { AuthResponse } from "@/types/auth.type";
import { API_ENDPOINTS } from "@/apis/endpoints";
import http from "@/utils/http";

export const authApi = {
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, body);
  },
  register(body: { email: string; password: string }) {
    return http.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, body);
  },
};
