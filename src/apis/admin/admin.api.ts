import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import { Admin } from "@/store/admin/adminStore";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";
export const adminApi = {
  getProfile() {
    return adminHttp.get<SuccessResponse<Admin>>(API_ENDPOINTS.ADMIN.PROFILE);
  },
};
