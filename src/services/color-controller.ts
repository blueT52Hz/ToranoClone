import axiosClient from "@/services/axiosClient";
import { Color } from "@/types/product";

const API_BASE_URL = "/colors";

// Lấy danh sách tất cả colors
export const getAllColors = async () => {
  const response = await axiosClient.get(`${API_BASE_URL}`);
  return response.data;
};

// Lấy chi tiết một color theo ID
export const getColorById = async (colorId: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/${colorId}`);
  return response.data;
};

// Tạo một color mới
export const createColor = async (color: Color) => {
  const response = await axiosClient.post(`${API_BASE_URL}`, color);
  return response.data;
};

// Cập nhật thông tin color
export const updateColor = async (colorId: string, color: Partial<Color>) => {
  const response = await axiosClient.put(`${API_BASE_URL}/${colorId}`, color);
  return response.data;
};

// Xóa một color
export const deleteColor = async (colorId: string) => {
  const response = await axiosClient.delete(`${API_BASE_URL}/${colorId}`);
  return response.data;
};
