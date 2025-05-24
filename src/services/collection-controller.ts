import axiosClient from "@/services/axiosClient";
import { Collection } from "@/types/product.type";

const API_BASE_URL = "/collections";

// Lấy danh sách tất cả collections
export const getAllCollections = async () => {
  const response = await axiosClient.get(`${API_BASE_URL}`);
  return response.data;
};

// Lấy chi tiết một collection theo ID
export const getCollectionById = async (collectionId: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/${collectionId}`);
  return response.data;
};

// Lấy danh sách collections con của một collection cha
export const getSubCollections = async (parentCollectionId: string) => {
  const response = await axiosClient.get(
    `${API_BASE_URL}/parent/${parentCollectionId}`,
  );
  return response.data;
};

// Tạo một collection mới
export const createCollection = async (collection: Collection) => {
  const response = await axiosClient.post(`${API_BASE_URL}`, collection);
  return response.data;
};

// Cập nhật thông tin collection
export const updateCollection = async (
  collectionId: string,
  collection: Partial<Collection>,
) => {
  const response = await axiosClient.put(
    `${API_BASE_URL}/${collectionId}`,
    collection,
  );
  return response.data;
};

// Xóa một collection
export const deleteCollection = async (collectionId: string) => {
  const response = await axiosClient.delete(`${API_BASE_URL}/${collectionId}`);
  return response.data;
};

// Thêm một sản phẩm vào collection
export const addProductToCollection = async (
  collectionId: string,
  productId: string,
) => {
  const response = await axiosClient.post(
    `${API_BASE_URL}/${collectionId}/products/${productId}`,
  );
  return response.data;
};

// Xóa một sản phẩm khỏi collection
export const removeProductFromCollection = async (
  collectionId: string,
  productId: string,
) => {
  const response = await axiosClient.delete(
    `${API_BASE_URL}/${collectionId}/products/${productId}`,
  );
  return response.data;
};
