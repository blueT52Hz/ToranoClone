import { Cart } from "@/types/cart.type";
import { create } from "zustand";
import { cartApi } from "@/apis/cart.api";
import { v4 as uuidv4 } from "uuid";

interface CartState {
  cart: Cart;
  addToCart: (variant_id: string, quantity: number) => void;
  removeFromCart: (cart_item_id: string) => void;
  updateCart: (cart_item_id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: (() => {
    const cartFromStorage = localStorage.getItem("cart");
    if (cartFromStorage) {
      const parsedCart = JSON.parse(cartFromStorage);
      return {
        ...parsedCart,
        created_at: new Date(parsedCart.created_at),
        updated_at: new Date(parsedCart.updated_at),
      };
    }
    const newCart = {
      cart_id: uuidv4(),
      cart_items: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    localStorage.setItem("cart", JSON.stringify(newCart));
    return newCart;
  })(),
  addToCart: (variant_id: string, quantity: number) => {
    cartApi.addToCart({ variant_id, quantity });
  },
  removeFromCart: (cart_item_id: string) => {
    set((state) => ({
      cart: {
        ...state.cart,
        cart_items: state.cart.cart_items.filter(
          (item) => item.cart_item_id !== cart_item_id,
        ),
      },
    }));
  },
  updateCart: (cart_item_id: string, quantity: number) => {
    set((state) => ({
      cart: {
        ...state.cart,
        cart_items: state.cart.cart_items.map((item) =>
          item.cart_item_id === cart_item_id ? { ...item, quantity } : item,
        ),
      },
    }));
  },
  clearCart: () => {
    set({
      cart: {
        cart_id: "",
        cart_items: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  },
}));
