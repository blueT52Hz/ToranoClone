import { AuthResponse } from "@/types/auth.type";
import { API_ENDPOINTS } from "@/apis/endpoints";
import http from "@/utils/http";

export const userApi = {
  changePassword(body: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) {
    return http.put<AuthResponse>(API_ENDPOINTS.USER.CHANGE_PASSWORD, body);
  },
  updateProfile(body: {
    full_name: string;
    gender: "Nam" | "Nữ" | "Khác";
    date_of_birth: string;
  }) {
    return http.put<AuthResponse>(API_ENDPOINTS.USER.UPDATE_PROFILE, body);
  },
};
