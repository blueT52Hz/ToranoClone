import { createContext, useContext, useState, useEffect } from "react";
import { ShippingAddress, User } from "@/types/user";
import { clearLocalCart, getLocalCart, setLocalCart } from "@/utils/storage";
import { Cart, CartItem, Order } from "@/types/cart";
import { message, notification } from "antd";
import { Image } from "antd";
import { CheckCircle, X } from "lucide-react";
import "./style.css";
import { getCartByUserId } from "@/services/client/cart/cart";
import { login } from "@/services/client/user/user";
import { supabase } from "@/services/supabaseClient";
import { v4 } from "uuid";
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
  updateUser: (updatedUser: Partial<User>) => void;
  finalizePayment: () => void;
  addresses: ShippingAddress[];
  addAddress: (
    address: Omit<
      ShippingAddress,
      "address_id" | "user_id" | "created_at" | "updated_at"
    >
  ) => ShippingAddress;
  updateAddress: (address: ShippingAddress) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  getDefaultAddress: () => ShippingAddress | undefined;
}

const UserContext = createContext<UserContextType>({
  user: null,
  cart: {
    cart_id: "init",
    cartItems: [],
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
  updateUser: (updatedUser: Partial<User>) => {
    throw new Error("Function not implemented.");
  },
  finalizePayment: () => {
    throw new Error("Function not implemented.");
  },
  addresses: [],
  addAddress: function (
    address: Omit<
      ShippingAddress,
      "address_id" | "user_id" | "created_at" | "updated_at"
    >
  ): ShippingAddress {
    throw new Error("Function not implemented.");
  },
  updateAddress: function (address: ShippingAddress): void {
    throw new Error("Function not implemented.");
  },
  deleteAddress: function (addressId: string): void {
    throw new Error("Function not implemented.");
  },
  setDefaultAddress: function (addressId: string): void {
    throw new Error("Function not implemented.");
  },
  getDefaultAddress: function (): ShippingAddress | undefined {
    throw new Error("Function not implemented.");
  },
});
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart>(getLocalCart());
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);

  useEffect(() => {
    console.log("Change User");

    if (user !== null) {
      const getCart = async () => {
        const result = await getCartByUserId(user.user_id);
        setCart(result);
        console.log(result);
      };
      getCart();
    } else {
      setCart(getLocalCart());
    }
  }, [user]);

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;

    setUser((prev) => ({
      ...prev!,
      ...updatedUser,
      updated_at: new Date().toISOString(),
    }));
  };

  const addToCart = async (item: CartItem) => {
    console.log(item);

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
          cartItem.variant.product.sale_price ||
          cartItem.variant.product.base_price;
        return acc + price * cartItem.quantity;
      }, 0);

      const newCart = {
        ...prev,
        cartItems: updatedItems,
        cart_total_price: newTotalPrice,
      };

      // Hàm hiển thị thông báo chung
      const showSuccessNotification = (item: CartItem) => {
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
                  width={72} // Sử dụng số thay vì chuỗi
                  height={72} // Sử dụng số thay vì chuỗi
                  alt={item.variant.product.name} // Thêm thuộc tính alt bắt buộc
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <div className="font-semibold text-sm">
                  {item.variant.product.name}
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
                    {(item.variant.product.sale_price
                      ? item.variant.product.sale_price * item.quantity
                      : item.variant.product.base_price * item.quantity
                    ).toLocaleString()}
                    ₫
                  </p>
                </div>
              </div>
            </div>
          ),
          placement: "topRight",
          duration: 2,
        });
      };

      // Nếu có user, đồng bộ lên Supabase
      if (user) {
        const updateCartItem = async () => {
          const { data, error } = await supabase
            .from("cart_item")
            .update({
              cart_id: prev.cart_id, // Giả sử bạn đã có cart_id trong state
              variant_id: item.variant.variant_id,
              quantity: item.quantity,
            })
            .eq("cart_item_id", item.cart_item_id);

          if (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
          } else {
            console.log("Cập nhật giỏ hàng thành công:", data);
            showSuccessNotification(item); // Hiển thị thông báo thành công
          }
        };

        const addCartItem = async () => {
          console.log(prev.cart_id);

          const { data, error } = await supabase.from("cart_item").insert({
            cart_id: prev.cart_id,
            variant_id: item.variant.variant_id,
            quantity: item.quantity,
          });

          if (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
          } else {
            console.log("Thêm vào giỏ hàng thành công:", data);
            showSuccessNotification(item); // Hiển thị thông báo thành công
          }
        };

        if (existingItemIndex !== -1) {
          updateCartItem();
        } else {
          addCartItem();
        }
      } else {
        // Nếu không có user, lưu vào localStorage
        setLocalCart(newCart);
        showSuccessNotification(item); // Hiển thị thông báo thành công
      }

      console.log(newCart);

      return newCart;
    });
  };

  const addAddress = (
    address: Omit<
      ShippingAddress,
      "address_id" | "user_id" | "created_at" | "updated_at"
    >
  ) => {
    if (!user) throw new Error("User not logged in");
    const newAddress: ShippingAddress = {
      ...address,
      address_id: v4(),
      user_id: user?.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (addresses.length === 0 || address.is_default) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, is_default: false }))
      );
    }

    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = (updatedAddress: ShippingAddress) => {
    if (updatedAddress.is_default) {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          is_default: addr.address_id === updatedAddress.address_id,
        }))
      );
    } else {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.address_id === updatedAddress.address_id
            ? { ...updatedAddress, updated_at: new Date() }
            : addr
        )
      );
    }
  };

  const deleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find(
      (addr) => addr.address_id === addressId
    );

    setAddresses((prev) =>
      prev.filter((addr) => addr.address_id !== addressId)
    );

    if (addressToDelete?.is_default && addresses.length > 1) {
      setAddresses((prev) => {
        const newAddresses = [...prev];
        if (newAddresses.length > 0) {
          newAddresses[0].is_default = true;
        }
        return newAddresses;
      });
    }
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_default: addr.address_id === addressId,
      }))
    );
  };

  const getDefaultAddress = () => {
    return addresses.find((addr) => addr.is_default);
  };

  const removeItemFromCart = async (variant_id: string) => {
    setCart((prev) => {
      const newCartItems = prev.cartItems.filter(
        (cartItem) => cartItem.variant.variant_id !== variant_id
      );

      const newTotalPrice = newCartItems.reduce((acc, cartItem) => {
        const price =
          cartItem.variant.product.sale_price ||
          cartItem.variant.product.base_price;
        return acc + price * cartItem.quantity;
      }, 0);

      const newCart = {
        ...prev,
        cartItems: newCartItems,
        cart_total_price: newTotalPrice,
      };

      // Nếu có user, xóa sản phẩm khỏi giỏ hàng trên Supabase
      if (user) {
        const removeCartItemFromSupabase = async () => {
          const { error } = await supabase
            .from("cart_item")
            .delete()
            .eq("variant_id", variant_id)
            .eq("cart_id", cart.cart_id); // Đảm bảo chỉ xóa sản phẩm của user hiện tại

          if (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
          } else {
            console.log("Xóa sản phẩm khỏi giỏ hàng thành công");
          }
        };

        removeCartItemFromSupabase();
      } else {
        // Nếu không có user, lưu giỏ hàng mới vào localStorage
        setLocalCart(newCart);
      }

      return newCart;
    });
  };

  const clearCart = () => {
    setCart({
      cart_id: user ? user.user_id : "guest",
      cartItems: [],
    });
    if (!user) clearLocalCart();
  };

  const updateItemQuantity = async (variant_id: string, quantity: number) => {
    setCart((prev) => {
      const newCartItems = prev.cartItems.map((cartItem) =>
        cartItem.variant.variant_id === variant_id
          ? { ...cartItem, quantity }
          : cartItem
      );

      const newTotalPrice = newCartItems.reduce((acc, cartItem) => {
        const price =
          cartItem.variant.product.sale_price ||
          cartItem.variant.product.base_price;
        return acc + price * cartItem.quantity;
      }, 0);

      const newCart = {
        ...prev,
        cartItems: newCartItems,
        cart_total_price: newTotalPrice,
      };

      // Nếu có user, cập nhật số lượng sản phẩm trên Supabase
      if (user) {
        const updateCartItemQuantityOnSupabase = async () => {
          const { error } = await supabase
            .from("cart_item")
            .update({ quantity })
            .eq("variant_id", variant_id)
            .eq("cart_id", cart.cart_id); // Đảm bảo chỉ cập nhật sản phẩm của user hiện tại

          if (error) {
            console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
          } else {
            console.log("Cập nhật số lượng sản phẩm thành công");
          }
        };

        updateCartItemQuantityOnSupabase();
      } else {
        // Nếu không có user, lưu giỏ hàng mới vào localStorage
        setLocalCart(newCart);
      }

      return newCart;
    });
  };

  const handleLogOut = () => {
    setUser(null);
    setCart(getLocalCart());
    notification.success({
      message: "Đăng xuất thành công",
      description: null,
      placement: "topRight",
    });
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      setUser(data);
      notification.success({
        message: "Đăng nhập thành công",
        description: null,
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi đăng nhập",
        description: String(error),
        placement: "topRight",
      });
    }
  };

  const finalizePayment = () => {
    // setOrders(prev =>
    //   prev.map(order =>
    //     order.order_id === orderId
    //       ? { ...order, status: "pending_approval" }
    //       : order
    //   )
    // );

    // Clear the cart after successful payment
    setCart({
      cart_id: v4(),
      cartItems: [],
    });
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
        updateUser,
        finalizePayment,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        updateAddress,
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
    updateUser: context.updateUser,
    finalizePayment: context.finalizePayment,
    addresses: context.addresses,
    addAddress: context.addAddress,
    deleteAddress: context.deleteAddress,
    setDefaultAddress: context.setDefaultAddress,
    getDefaultAddress: context.getDefaultAddress,
    updateAddress: context.updateAddress,
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
