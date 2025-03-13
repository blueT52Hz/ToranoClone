import axiosClient from "@/services/axiosClient";
import { Size } from "@/types/product";

const API_BASE_URL = "/sizes";

// Lấy danh sách tất cả size
export const getAllSizes = async () => {
  const response = await axiosClient.get(API_BASE_URL);
  return response.data;
};

// Lấy thông tin một size theo ID
export const getSizeById = async (sizeId: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/${sizeId}`);
  return response.data;
};

// Tạo một size mới
export const createSize = async (size: Omit<Size, "id">) => {
  const response = await axiosClient.post(API_BASE_URL, size);
  return response.data;
};

// Cập nhật thông tin size
export const updateSize = async (sizeId: string, size: Partial<Size>) => {
  const response = await axiosClient.put(`${API_BASE_URL}/${sizeId}`, size);
  return response.data;
};

// Xóa size
export const deleteSize = async (sizeId: string) => {
  const response = await axiosClient.delete(`${API_BASE_URL}/${sizeId}`);
  return response.data;
};
