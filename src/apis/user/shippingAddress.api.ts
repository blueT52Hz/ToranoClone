import { AuthResponse } from "@/types/auth.type";
import { API_ENDPOINTS } from "@/apis/user/endpoints";
import http from "@/utils/http";
import { ShippingAddress } from "@/types/user.type";
import { SuccessResponse } from "@/types/utils.type";

export const shippingAddressApi = {
  getShippingAddress() {
    return http.get<AuthResponse>(API_ENDPOINTS.USER.ADDRESS);
  },
  addShippingAddress(
    body: Omit<
      ShippingAddress,
      "user_id" | "address_id" | "created_at" | "updated_at"
    >,
  ) {
    return http.post<AuthResponse>(API_ENDPOINTS.USER.ADDRESS, body);
  },
  updateShippingAddress(
    addressId: string,
    body: Omit<
      ShippingAddress,
      "user_id" | "address_id" | "created_at" | "updated_at"
    >,
  ) {
    return http.put<AuthResponse>(
      `${API_ENDPOINTS.USER.ADDRESS}/${addressId}`,
      body,
    );
  },
  deleteShippingAddress(addressId: string) {
    return http.delete<AuthResponse>(
      `${API_ENDPOINTS.USER.ADDRESS}/${addressId}`,
    );
  },
  getShippingAddresses: () => {
    return http.get<SuccessResponse<ShippingAddress[]>>("/shipping-addresses");
  },
};
