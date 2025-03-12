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
import { message, notification } from "antd";
import { Image } from "antd";
import { CheckCircle, X } from "lucide-react";
import { login as loginService } from "@/services/auth-controller";
import "./style.css";
interface UserContextType {
  user: User | null;
  cart: Cart;
  setUser: (user: User | null) => void;
  handleLogOut: () => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  addToCart: (item: CartItem) => void;
  removeItemFromCart: (variant_id: string) => void;
  updateItemQuantity: (variant_id: string, quantity: number) => void;
  clearCart: () => void;
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
  removeItemFromCart: function (variant_id: string): void {
    throw new Error("Function not implemented.");
  },
  updateItemQuantity: function (variant_id: string, quantity: number): void {
    throw new Error("Function not implemented.");
  },
  clearCart: function (): void {
    throw new Error("Function not implemented.");
  },
  handleLogOut: function (): void {
    throw new Error("Function not implemented.");
  },
  async handleLogin(email: string, password: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart>(getLocalCart());

  useEffect(() => {
    setCart(getLocalCart());

    // if (user) {
    //   setCart(user.cart);
    // } else {
    //   setCart(getLocalCart());
    // }
  }, [user]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.cartItems.findIndex(
        (cartItem) => cartItem.variant.variant_id === item.variant.variant_id
      );

      const updatedItems =
        existingItemIndex !== -1
          ? prev.cartItems.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            )
          : [...prev.cartItems, item];

      const newTotalPrice = updatedItems.reduce((acc, cartItem) => {
        const price =
          cartItem.product.sale_price || cartItem.product.base_price;
        return acc + price * cartItem.quantity;
      }, 0);

      const newCart = {
        ...prev,
        cartItems: updatedItems,
        cart_total_price: newTotalPrice,
      };

      if (!user) {
        setLocalCart(newCart);
        const openNotificationWithIcon = (item: CartItem) => {
          notification.open({
            message: (
              <div className="flex items-center">
                <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                <div>{"Thêm vào giỏ hàng thành công"}</div>
              </div>
            ),
            style: { marginInlineStart: "0px !important" },
            description: (
              <div className="flex pt-3 min-w-full overflow-y-auto h-full">
                <div className="mr-4">
                  <Image
                    src={item.variant.image.image_url}
                    className="object-cover rounded-md"
                    width={"4.5rem"}
                    height={"4.5rem"}
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <div className="font-semibold text-sm">
                    {item.product.name}
                  </div>
                  <div className="flex justify-start">
                    <p className="text-sm text-gray-500 ">
                      {item.variant.color.color_name} /{" "}
                      {item.variant.size.size_code}
                    </p>
                    <p className="text-sm text-gray-500 mx-2">|</p>
                    <p className="text-sm text-gray-500 ">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="flex justify-start gap-2 items-center">
                    <p className="text-sm text-gray-500">Tổng tiền:</p>
                    <p className="font-semibold text-black">
                      {(item.product.sale_price
                        ? item.product.sale_price * item.quantity
                        : item.product.base_price * item.quantity
                      ).toLocaleString()}
                      ₫
                    </p>
                  </div>
                </div>
              </div>
            ),
            placement: "topRight",
            duration: 200,
          });
        };
        openNotificationWithIcon(item);
      }

      console.log(newCart);

      return newCart;
    });
  };

  const removeItemFromCart = (variant_id: string) => {
    setCart((prev) => {
      const newCartItems = prev.cartItems.filter(
        (cartItem) => cartItem.variant.variant_id !== variant_id
      );

      const newTotalPrice = newCartItems.reduce((acc, cartItem) => {
        const price =
          cartItem.product.sale_price || cartItem.product.base_price;
        return acc + price * cartItem.quantity;
      }, 0);

      const newCart = {
        ...prev,
        cartItems: newCartItems,
        cart_total_price: newTotalPrice,
      };

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

  const updateItemQuantity = (variant_id: string, quantity: number) => {
    setCart((prev) => {
      const newTotalPrice = prev.cartItems.reduce((acc, cartItem) => {
        const price =
          cartItem.product.sale_price || cartItem.product.base_price;
        return acc + price * cartItem.quantity;
      }, 0);

      const newCart = {
        ...prev,
        cart_total_price: newTotalPrice,
        cartItems: prev.cartItems.map((cartItem) =>
          cartItem.variant.variant_id === variant_id
            ? { ...cartItem, quantity }
            : cartItem
        ),
      };

      if (!user) {
        setLocalCart(newCart);
      }

      return newCart;
    });
  };

  const handleLogOut = () => {
    setUser(null);
    setCart(getLocalCart());
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await loginService({ email, password });
      setUser(data.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        cart,
        setUser,
        addToCart,
        removeItemFromCart,
        clearCart,
        updateItemQuantity,
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
  return {
    user: context.user,
    setUser: context.setUser,
    handleLogOut: context.handleLogOut,
    handleLogin: context.handleLogin,
  };
};

export const useCart = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return {
    cart: context.cart,
    addToCart: context.addToCart,
    removeItemFromCart: context.removeItemFromCart,
    clearCart: context.clearCart,
    updateItemQuantity: context.updateItemQuantity,
  };
};
