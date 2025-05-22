// export interface User {
//   user_id: string;
//   full_name: string;
//   gender: "Nam" | "Nữ" | "Khác";
//   date_of_birth: string;
//   email: string;
//   password: string;
//   created_at: string;
//   updated_at: string;
// }

export interface User {
  date_of_birth: string;
  email: string;
  full_name: string;
  gender: "Nam" | "Nữ" | "Khác";
  status: "active" | "inactive" | "banned";
  user_id: string;
}

export interface ShippingAddress {
  address_id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  address_detail: string;
  city: string;
  district: string;
  ward: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Province {
  id: string;
  full_name: string;
}

export interface District {
  id: string;
  full_name: string;
}

export interface Ward {
  id: string;
  full_name: string;
}
