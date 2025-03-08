import { Cart } from "@/types/cart";

export const getLocalCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : { cart_id: "guest", items: [] };
};

export const setLocalCart = (cart: Cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearLocalCart = () => {
  localStorage.removeItem("cart");
};
