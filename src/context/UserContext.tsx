import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { mockUsers, User } from "@/types/user";
import { clearLocalCart, getLocalCart, setLocalCart } from "@/utils/storage";
import { Cart, CartItem } from "@/types/cart";
interface UserContextType {
  user: User | null;
  cart: Cart;
  setUser: (user: User | null) => void;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  handleLogOut: () => void;
  handleLogin: (username: string, password: string) => User;
}

const UserContext = createContext<UserContextType>({
  user: null,
  cart: {
    cart_id: "init",
    cartItems: [],
    cart_total_price: 0,
  },
  setUser: function (user: User | null): void {
    throw new Error("Function not implemented.");
  },
  addToCart: function (item: CartItem): void {
    throw new Error("Function not implemented.");
  },
  clearCart: function (): void {
    throw new Error("Function not implemented.");
  },
  handleLogOut: function (): void {
    throw new Error("Function not implemented.");
  },
  handleLogin: function (): User {
    throw new Error("Function not implemented.");
  },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart>(getLocalCart());

  useEffect(() => {
    if (user) {
      setCart(user.cart);
    } else {
      setCart(getLocalCart());
    }
  }, [user]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.cartItems.findIndex(
        (cartItem) => cartItem.variant_id === item.variant_id
      );

      const updatedItems =
        existingItemIndex !== -1
          ? prev.cartItems.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            )
          : [...prev.cartItems, item];

      const newCart = { ...prev, items: updatedItems };

      if (!user) {
        setLocalCart(newCart);
      }

      return newCart;
    });
  };

  const clearCart = () => {
    setCart({
      cart_id: user ? user.user_id : "guest",
      cartItems: [],
      cart_total_price: 0,
    });
    if (!user) clearLocalCart();
  };

  const handleLogOut = () => {
    setUser(null);
    setCart(getLocalCart());
  };

  const handleLogin = (email: string, password: string): User => {
    const foundUser = mockUsers.find(
      (user) => user.email === email && user.password === password
    );
    if (!foundUser) {
      throw new Error("Invalid email or password");
    }
    return foundUser;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        cart,
        setUser,
        addToCart,
        clearCart,
        handleLogOut,
        handleLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const useCart = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.cart;
};
