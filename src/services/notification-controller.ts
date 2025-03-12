import axiosClient from "@/api/axiosClient";

const API_BASE_URL = "/notifications";

interface Notification {
  id?: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

// Lấy danh sách thông báo của một user
export const getUserNotifications = async (userId: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

// Lấy chi tiết một thông báo theo ID
export const getNotificationById = async (notificationId: string) => {
  const response = await axiosClient.get(`${API_BASE_URL}/${notificationId}`);
  return response.data;
};

// Tạo một thông báo mới cho user
export const createNotification = async (
  userId: string,
  notification: Omit<Notification, "id">
) => {
  const response = await axiosClient.post(
    `${API_BASE_URL}/user/${userId}`,
    notification
  );
  return response.data;
};

// Đánh dấu thông báo là đã đọc
export const markNotificationAsRead = async (notificationId: string) => {
  const response = await axiosClient.put(
    `${API_BASE_URL}/${notificationId}/read`
  );
  return response.data;
};

// Xóa một thông báo
export const deleteNotification = async (notificationId: string) => {
  const response = await axiosClient.delete(
    `${API_BASE_URL}/${notificationId}`
  );
  return response.data;
};
