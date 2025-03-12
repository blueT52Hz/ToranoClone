import axiosClient from "@/api/axiosClient";
import { Product, ProductImage, ProductVariant } from "@/types/product";

const API_BASE_URL = "/products";

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async () => {
  const response = await axiosClient.get(API_BASE_URL);
  return response.data;
};

// Lấy thông tin một sản phẩm theo ID
export const getProductById = async (productId: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/${productId}`);
  return response.data;
};

// Tạo một sản phẩm mới
export const createProduct = async (product: Omit<Product, "id">) => {
  const response = await axiosClient.post(API_BASE_URL, product);
  return response.data;
};

// Cập nhật thông tin sản phẩm
export const updateProduct = async (
  productId: string,
  product: Partial<Product>
) => {
  const response = await axiosClient.put(
    `${API_BASE_URL}/${productId}`,
    product
  );
  return response.data;
};

// Xóa sản phẩm
export const deleteProduct = async (productId: string) => {
  const response = await axiosClient.delete(`${API_BASE_URL}/${productId}`);
  return response.data;
};

// Lấy danh sách biến thể của một sản phẩm
export const getProductVariants = async (productId: string) => {
  const response = await axiosClient.get(
    `${API_BASE_URL}/${productId}/variants`
  );
  return response.data;
};

// Thêm một biến thể mới vào sản phẩm
export const addVariantToProduct = async (
  productId: string,
  variant: Omit<ProductVariant, "id">
) => {
  const response = await axiosClient.post(
    `${API_BASE_URL}/${productId}/variants`,
    variant
  );
  return response.data;
};

// Cập nhật biến thể
export const updateVariant = async (
  variantId: string,
  variant: Partial<ProductVariant>
) => {
  const response = await axiosClient.put(
    `${API_BASE_URL}/variants/${variantId}`,
    variant
  );
  return response.data;
};

// Xóa biến thể
export const deleteVariant = async (variantId: string) => {
  const response = await axiosClient.delete(
    `${API_BASE_URL}/variants/${variantId}`
  );
  return response.data;
};

// Lấy danh sách hình ảnh của sản phẩm
export const getProductImages = async (productId: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/${productId}/images`);
  return response.data;
};

// Thêm hình ảnh vào sản phẩm
export const addImageToProduct = async (
  productId: string,
  image: Omit<ProductImage, "id">
) => {
  const response = await axiosClient.post(
    `${API_BASE_URL}/${productId}/images`,
    image
  );
  return response.data;
};

// Xóa hình ảnh
export const deleteImage = async (imageId: string) => {
  const response = await axiosClient.delete(
    `${API_BASE_URL}/images/${imageId}`
  );
  return response.data;
};
