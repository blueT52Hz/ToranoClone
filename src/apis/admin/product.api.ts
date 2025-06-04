import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import {
  ProductPreview,
  ProductForm,
  ProductDetailAdmin,
} from "@/types/product.type";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";

interface ProductPreviewResponse {
  products: ProductPreview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const productApi = {
  getProducts(
    page: number,
    limit: number,
    search: string,
    status: "draft" | "published" | "all" = "all",
    sortBy:
      | "product_name"
      | "product_code"
      | "created_at"
      | "updated_at"
      | "price"
      | "discount"
      | "quantity_total"
      | "quantity_min"
      | "status" = "created_at",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return adminHttp.get<SuccessResponse<ProductPreviewResponse>>(
      `${API_ENDPOINTS.PRODUCT.PRODUCTS}?page=${page}&limit=${limit}&search=${search}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    );
  },
  createProduct(data: ProductForm) {
    return adminHttp.post(API_ENDPOINTS.PRODUCT.PRODUCTS, data);
  },

  getProduct(productId: string) {
    return adminHttp.get<SuccessResponse<ProductDetailAdmin>>(
      `${API_ENDPOINTS.PRODUCT.PRODUCTS}/${productId}`,
    );
  },

  updateProduct(productId: string, data: ProductForm) {
    return adminHttp.put(
      `${API_ENDPOINTS.PRODUCT.PRODUCTS}/${productId}`,
      data,
    );
  },

  deleteProduct(productId: string) {
    return adminHttp.delete(`${API_ENDPOINTS.PRODUCT.PRODUCTS}/${productId}`);
  },
};
