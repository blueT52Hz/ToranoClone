export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  USER: {
    CHANGE_PASSWORD: "/user/changePassword",
    UPDATE_PROFILE: "/user/profile",
    PROFILE: "user/profile",
    ADDRESS: "/shipping-addresses",
  },
  CART: {
    ADD_TO_CART: "/cart/items",
    UPDATE_CART: "/cart/items",
    REMOVE_CART_ITEM: "/cart/items",
    GET_CART: "/cart",
  },
} as const;
