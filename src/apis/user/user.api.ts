import { AuthResponse } from "@/types/auth.type";
import { API_ENDPOINTS } from "@/apis/user/endpoints";
import http from "@/utils/http";
import { User } from "@/types/user.type";
import { SuccessResponse } from "@/types/utils.type";

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
  getProfile() {
    return http.get<SuccessResponse<User>>(API_ENDPOINTS.USER.PROFILE);
  },
};
