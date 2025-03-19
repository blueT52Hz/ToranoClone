import { ShippingAddress, User } from "@/types/user";
import { supabase } from "@/services/supabaseClient";
import { createCart } from "@/services/client/cart/cart";
import { Cart, CartItem, Order } from "@/types/cart";

export const registerUser = async (user: User) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name: user.full_name,
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        email: user.email,
        password: user.password,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    ])
    .select();
  if (error) {
    throw error.message;
  }

  const newUser = data?.[0] as User;

  await createCart(newUser.user_id);

  return newUser;
};

export const login = async (email: string, password: string) => {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error || !users || users.length === 0) {
    throw new Error("Email hoặc mật khẩu không chính xác");
  }

  const user = users[0] as User;

  // Kiểm tra mật khẩu (so sánh trực tiếp)
  if (user.password !== password) {
    throw new Error("Email hoặc mật khẩu không chính xác");
  }

  return user;
};

export const getShippingAddressesByUserId = async (
  userId: string
): Promise<ShippingAddress[]> => {
  const { data, error } = await supabase
    .from("shipping_address") // Tên bảng
    .select("*") // Lấy tất cả các cột
    .eq("user_id", userId);

  if (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error;
  }

  return data as ShippingAddress[];
};

export const createShippingAddressWithoutUserId = async (
  shipping_address: ShippingAddress
) => {
  const { data, error } = await supabase
    .from("shipping_address")
    .insert({ ...shipping_address, user_id: null })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const createOrderByUserId = async (orderData: {
  order_id: string;
  user_id?: string;
  cart_id: string;
  address_id: string;
  status: string;
  payment_method: string;
  note: string | null;
  discount: number | null;
  shipping_fee: number;
  final_price: number;
}) => {
  const { data, error } = await supabase
    .from("order")
    .insert({ ...orderData })
    .select();

  if (error) throw error;
  return data;
};

// Nếu người dùng không đăng nhập
export const createOrderWithoutUserId = async (
  cart: Cart,
  orderData: {
    status: string;
    payment_method: string;
    note: string | null;
    discount: number | null;
    shipping_fee: number;
    final_price: number;
  },
  shipping_address: ShippingAddress
) => {
  const cartResult = await createCartWithoutUserId(cart);
  console.log(cartResult);

  // Tạo địa chỉ không có user_id
  const newShippingAddress =
    await createShippingAddressWithoutUserId(shipping_address);
  const { data, error } = await supabase
    .from("order")
    .insert({
      ...orderData,
      cart_id: cartResult.cart_id,
      address_id: newShippingAddress.address_id,
    })
    .select()
    .single();
  console.log(data);
  if (error) throw error;
  return data;
};

export const createCartByUserId = async (userId: string): Promise<Cart> => {
  const { data, error } = await supabase
    .from("cart")
    .insert({ user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return { cart_id: data.cart_id, cartItems: [] };
};

export const createCartWithoutUserId = async (cart: Cart): Promise<Cart> => {
  const { data: cartData, error: cartError } = await supabase
    .from("cart")
    .insert({})
    .select()
    .single();
  if (cartError) throw cartError;

  Promise.all(
    cart.cartItems.map(async (item) => {
      return await createCartItem(item, cartData);
    })
  );

  return cartData;
};

export const createCartItem = async (cartItem: CartItem, cart: Cart) => {
  const { data, error } = await supabase
    .from("cart_item")
    .insert({
      cart_id: cart.cart_id,
      variant_id: cartItem.variant.variant_id,
      quantity: cartItem.quantity,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
