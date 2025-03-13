import { v4 as uuidv4 } from "uuid";

export interface User {
  user_id: string;
  full_name: string;
  gender: "Nam" | "Nữ" | "Khác";
  date_of_birth: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  address_id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  address_detail: string;
  ward: string; // Phường/Xã
  district: string; // Quận/Huyện
  city: string; // Tỉnh/Thành phố
  country: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}
