import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";
import { User } from "@/types/user.type";

interface UserResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const userApi = {
  getUsers(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    gender: "Nam" | "Nữ" | "Khác" | "all" = "all",
    status: "active" | "inactive" | "banned" | "all" = "all",
    sortBy:
      | "full_name"
      | "email"
      | "gender"
      | "date_of_birth"
      | "status"
      | "created_at"
      | "last_login_at"
      | "updated_at" = "created_at",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return adminHttp.get<SuccessResponse<UserResponse>>(
      `${API_ENDPOINTS.USER.USERS}?page=${page}&limit=${limit}&search=${search}&gender=${gender}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    );
  },
  getUserById(id: string) {
    return adminHttp.get<SuccessResponse<User>>(
      `${API_ENDPOINTS.USER.USER_ID}/${id}`,
    );
  },
};
