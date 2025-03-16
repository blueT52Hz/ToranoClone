import { Cart } from "@/types/cart";

export const getLocalCart = (): Cart => {
  const cart = localStorage.getItem("cart");

  try {
    const parsedCart = cart ? JSON.parse(cart) : null;

    if (
      parsedCart &&
      typeof parsedCart === "object" &&
      typeof parsedCart.cart_id === "string" &&
      Array.isArray(parsedCart.cartItems) &&
      typeof parsedCart.cart_total_price === "number"
    ) {
      return parsedCart;
    }
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
  }

  return { cart_id: "guest", cartItems: [], cart_total_price: 0 };
};

export const setLocalCart = (cart: Cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearLocalCart = () => {
  localStorage.removeItem("cart");
};
