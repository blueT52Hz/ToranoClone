// src/context/AppContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { Cart, CartItem } from "@/types/cart";

const LOCAL_STORAGE_CART_KEY = "guest_cart";

interface AppContextType {
  user: User | null;
  cart: Cart | null;
  cartItems: CartItem[];
  login: (userData: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItem_id: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 🛒 Lấy giỏ hàng từ localStorage nếu User là null
  useEffect(() => {
    if (!user) {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart.items || []);
      }
    }
  }, [user]);

  // 🛍 Lưu giỏ hàng vào localStorage nếu User là null
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify({ items: cartItems })
      );
    }
  }, [cartItems, user]);

  // 🔑 Đăng nhập
  const login = (userData: User) => {
    setUser(userData);
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY); // Xóa giỏ hàng cũ khi user đăng nhập
  };

  // 🚪 Đăng xuất
  const logout = () => {
    setUser(null);
  };

  // 🛒 Thêm sản phẩm vào giỏ hàng
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  // 🗑 Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (cartItem_id: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartItem_id !== cartItem_id)
    );
  };

  // ❌ Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    if (!user) {
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        cartItems,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
