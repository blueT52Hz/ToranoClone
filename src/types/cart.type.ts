import { ShippingAddress } from "@/types/user.type";

export interface Order {
  order_id: string;
  created_at: Date;
  shippingAddress: ShippingAddress;
  cart: Cart;
  note: string | null;
  payment_method: "cod" | "online_payment" | "bank_transfer";
  status:
    | "pending_payment"
    | "pending_approval"
    | "shipping"
    | "completed"
    | "canceled";
  discount: number | null;
  shipping_fee: number | 30000;
  final_price: number;
}

export interface Cart {
  cart_id: string;
  cart_items: CartItem[];
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  cart_item_id: string;
  product: {
    product_id: string;
    product_name: string;
    product_slug: string;
    base_price: number;
    sale_price: number | null;
    discount: number;
  };
  variant: {
    variant_id: string;
    size: string;
    color: string;
    color_code: string;
    image: string;
  };
  quantity: number;
  created_at: Date;
}
