import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import { CategoryProduct } from "@/types/category.type";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";

export const categoryApi = {
  getCategoriesForProduct() {
    return adminHttp.get<SuccessResponse<CategoryProduct[]>>(
      `${API_ENDPOINTS.CATEGORY.CATEGORIES_FOR_PRODUCT}`,
    );
  },
};
