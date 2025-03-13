import { supabase } from "../../supabaseClient";

export const createCart = async (userId: string) => {
  const { error } = await supabase.from("cart").insert([
    {
      user_id: userId,
    },
  ]);

  if (error) {
    throw `Lỗi khi tạo giỏ hàng: ${error.message}`;
  }
};

export const getLatestCartByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw `Lỗi khi lấy giỏ hàng mới nhất: ${error.message}`;
  }

  return data;
};
