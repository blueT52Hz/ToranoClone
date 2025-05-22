import { Cart, CartItem } from "@/types/cart.type";
import { API_ENDPOINTS } from "@/apis/user/endpoints";
import http from "@/utils/http";
import { SuccessResponse } from "@/types/utils.type";

export const cartApi = {
  getCart() {
    return http.get<SuccessResponse<Cart>>(API_ENDPOINTS.CART.GET_CART);
  },
  addToCart(body: { variant_id: string; quantity: number }) {
    return http.post<SuccessResponse<CartItem>>(
      API_ENDPOINTS.CART.ADD_TO_CART,
      body,
    );
  },
  updateCart(body: { cart_item_id: string; quantity: number }) {
    return http.put<SuccessResponse<Cart>>(
      `${API_ENDPOINTS.CART.UPDATE_CART}/${body.cart_item_id}`,
      body,
    );
  },
  removeCartItem(cart_item_id: string) {
    return http.delete<SuccessResponse<Cart>>(
      `${API_ENDPOINTS.CART.REMOVE_CART_ITEM}/${cart_item_id}`,
    );
  },
};
