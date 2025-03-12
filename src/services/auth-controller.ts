import axiosClient from "@/api/axiosClient";

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Đăng ký tài khoản
export const register = async (data: RegisterData) => {
  const response = await axiosClient.post(`/register`, data);
  return response.data;
};

// Đăng nhập
export const login = async (data: LoginData) => {
  const response = await axiosClient.post(`$/login`, data);
  return response.data;
};
