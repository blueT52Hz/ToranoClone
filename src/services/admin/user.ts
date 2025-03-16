import { supabase } from "../supabaseClient";

export const getAllUsers = async () => {
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select();

  if (usersError) {
    throw new Error(`Lỗi khi lấy dữ liệu người dùng: ${usersError.message}`);
  }

  // 2. Với mỗi người dùng, đếm số lượng đơn hàng từ bảng order
  const usersWithOrderCount = await Promise.all(
    users.map(async (user) => {
      // Đếm số lượng đơn hàng của người dùng hiện tại
      const { count, error: orderError } = await supabase
        .from("order")
        .select("*", { count: "exact", head: true }) // Đếm số lượng đơn hàng
        .eq("user_id", user.user_id); // Lọc theo user_id

      if (orderError) {
        throw new Error(`Lỗi khi lấy số lượng đơn hàng: ${orderError.message}`);
      }

      // Kết hợp thông tin người dùng và số lượng đơn hàng
      return {
        ...user,
        orders_count: count || 0, // Nếu không có đơn hàng, đặt order_count = 0
      };
    })
  );

  // 3. Trả về danh sách người dùng với số lượng đơn hàng
  return usersWithOrderCount;
};
