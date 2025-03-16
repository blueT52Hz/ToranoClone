import { ShippingAddress } from "@/types/user";
import { Product, ProductVariant } from "./product";

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
}

export interface CartItem {
  created_at: Date;
  cart_item_id: string;
  variant: ProductVariant;
  quantity: number;
}
