import axiosClient from "@/services/axiosClient";
import { User } from "@/types/user.type";

const API_BASE_URL = "/users";

// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
  const response = await axiosClient.get(API_BASE_URL);
  return response.data;
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (id: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Lấy thông tin người dùng theo email
export const getUserByEmail = async (email: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/email/${email}`);
  return response.data;
};

// Cập nhật thông tin người dùng
export const updateUser = async (id: string, user: Partial<User>) => {
  const response = await axiosClient.put(`${API_BASE_URL}/${id}`, user);
  return response.data;
};

// Xóa người dùng
export const deleteUser = async (id: string) => {
  const response = await axiosClient.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
