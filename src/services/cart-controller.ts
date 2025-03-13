// import axiosClient from "@/services/axiosClient";
// import { CartItem } from "@/types/cart";

// const API_BASE_URL = "/cart";

// // Xóa một sản phẩm khỏi giỏ hàng
// export const deleteCartItem = async (itemId: string) => {
//   const response = await axiosClient.delete(`${API_BASE_URL}/items/${itemId}`);
//   return response.data;
// };

// // Xóa toàn bộ giỏ hàng
// export const deleteCart = async (cartId: string) => {
//   const response = await axiosClient.delete(`${API_BASE_URL}/${cartId}`);
//   return response.data;
// };

// // Lấy giỏ hàng theo userId
// export const getCartByUserId = async (userId: string) => {
//   const response = await axiosClient.get(`${API_BASE_URL}/${userId}`);
//   return response.data;
// };

// // Lấy danh sách items trong giỏ hàng theo cartId
// export const getCartItems = async (cartId: string) => {
//   const response = await axiosClient.get(`${API_BASE_URL}/${cartId}/items`);
//   return response.data;
// };

// // Thêm giỏ hàng cho user
// export const createCart = async (userId: string) => {
//   const response = await axiosClient.post(`${API_BASE_URL}/${userId}`);
//   return response.data;
// };

// // Thêm sản phẩm vào giỏ hàng
// export const addItemToCart = async (cartId: string, item: CartItem) => {
//   const response = await axiosClient.post(
//     `${API_BASE_URL}/${cartId}/items`,
//     item
//   );
//   return response.data;
// };

// // Cập nhật số lượng sản phẩm trong giỏ hàng
// export const updateCartItem = async (itemId: string, quantity: number) => {
//   const response = await axiosClient.put(`${API_BASE_URL}/items/${itemId}`, {
//     quantity,
//   });
//   return response.data;
// };
