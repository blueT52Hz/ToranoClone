import { User } from "@/types/user";
import { supabase } from "@/services/supabaseClient";
import { createCart } from "@/services/client/cart/cart";

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
