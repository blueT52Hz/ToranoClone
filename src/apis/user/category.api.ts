import http from "@/utils/http";
import { SuccessResponse } from "@/types/utils.type";
import { Category } from "@/types/category.type";
import { Product } from "@/types/product.type";

export const categoryApi = {
  getCategories: async () => {
    return await http.get<SuccessResponse<Category[]>>("/categories");
  },
  getCategory: async (id: string) => {
    return await http.get<SuccessResponse<Category>>(`/categories/${id}`);
  },
  getCategoryProducts: async (id: string) => {
    return await http.get<SuccessResponse<Product[]>>(
      `/categories/${id}/products`,
    );
  },
};
