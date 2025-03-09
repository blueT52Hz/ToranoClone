import { Cart, Order } from "@/types/cart";
import { v4 as uuidv4 } from "uuid";

export interface User {
  user_id: string;
  full_name: string;
  gender: "Nam" | "Nữ" | "Khác";
  date_of_birth: Date;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  shipping_address: ShippingAddress[];
  order_history: Order[];
  cart: Cart;
}

export interface ShippingAddress {
  address_id: string;
  full_name: string;
  phone_number: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export const mockUsers: User[] = [
  {
    user_id: uuidv4(),
    full_name: "Nguyễn Hoa Thanh Tùng",
    gender: "Nam",
    date_of_birth: new Date("03/02/2004"),
    email: "tung@gmail.com",
    password: "tper2811",
    created_at: new Date("03/02/2004"),
    updated_at: new Date("03/02/2004"),
    shipping_address: [],
    order_history: [],
    cart: {
      cart_id: uuidv4(),
      cartItems: [],
      cart_total_price: 0,
    },
  },
];
