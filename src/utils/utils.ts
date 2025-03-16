export const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD") // Tách dấu khỏi ký tự gốc
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
      .replace(/đ/g, "d") // Chuyển đ -> d
      .replace(/Đ/g, "D") // Chuyển Đ -> D
      .toLowerCase() // Chuyển thành chữ thường
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu "-"
      .replace(/[^a-z0-9\-]/g, "") // Xóa ký tự đặc biệt (chỉ giữ lại a-z, 0-9, "-")
      .replace(/-+/g, "-") // Loại bỏ dấu "-" dư thừa
      .replace(/^-|-$/g, ""); // Loại bỏ dấu "-" ở đầu và cuối chuỗi
  };