import { ShippingAddress } from "@/types/user";

export interface Order {
  order_id: string;
  created_at: Date;
  shippingAddress: ShippingAddress;
  cart: Cart;
  note: string | null;
  payment_method: "cod" | "online_payment" | "bank_transfer";
  status: "pending_approval" | "shipping" | "completed" | "canceled";
  discount: number | null;
  shipping_fee: number | 30000;
  final_price: number;
}

export interface Cart {
  cart_id: string;
  cartItems: CartItem[];
  cart_total_price: number;
}

export interface CartItem {
  created_at: Date;
  cartItem_id: string;
  variant_id: string;
  quantity: number;
  cartItem_total_price: number;
  cartItem_base_price: number;
}
