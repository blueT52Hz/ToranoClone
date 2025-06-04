import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import {
  CategoryFormData,
  CategoryPreview,
  CategoryProduct,
  CategoryDetail,
} from "@/types/category.type";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";

interface CategoryPreviewResponse {
  categories: CategoryPreview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const categoryApi = {
  getCategories(
    page: number,
    limit: number,
    search: string,
    status: "all" | "publish" | "draft" | "archived" = "all",
    sortBy:
      | "category_name"
      | "category_slug"
      | "created_at"
      | "published_at"
      | "updated_at" = "created_at",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return adminHttp.get<SuccessResponse<CategoryPreviewResponse>>(
      `${API_ENDPOINTS.CATEGORY.CATEGORIES}?page=${page}&limit=${limit}&search=${search}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    );
  },
  getCategoryById(categoryId: string) {
    return adminHttp.get<SuccessResponse<CategoryDetail>>(
      `${API_ENDPOINTS.CATEGORY.CATEGORIES}/${categoryId}`,
    );
  },
  getCategoriesForProduct() {
    return adminHttp.get<SuccessResponse<CategoryProduct[]>>(
      `${API_ENDPOINTS.CATEGORY.CATEGORIES_FOR_PRODUCT}`,
    );
  },
  createCategory(data: CategoryFormData) {
    return adminHttp.post<SuccessResponse<CategoryPreview>>(
      `${API_ENDPOINTS.CATEGORY.CATEGORIES}`,
      data,
    );
  },
  updateCategory(categoryId: string, data: CategoryFormData) {
    return adminHttp.put<SuccessResponse<CategoryPreview>>(
      `${API_ENDPOINTS.CATEGORY.CATEGORIES}/${categoryId}`,
      data,
    );
  },
  deleteCategory(categoryId: string) {
    return adminHttp.delete<SuccessResponse<CategoryPreview>>(
      `${API_ENDPOINTS.CATEGORY.CATEGORIES}/${categoryId}`,
    );
  },
};
