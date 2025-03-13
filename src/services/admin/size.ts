import { notification } from "antd";
import { supabase } from "@/services/supabaseClient";
import { Size } from "@/types/product";

// Lấy tất cả size
export const getAllSizes = async (): Promise<Size[]> => {
  const { data, error } = await supabase.from("size").select("*");
  if (error) {
    notification.error({
      message: "Lỗi lấy tất cả kích thước!",
      description: error.message,
      placement: "topRight",
    });
    return [];
  }
  return data;
};

// Thêm size mới
export const addSize = async (size_code: string): Promise<Size | null> => {
  const { data, error } = await supabase
    .from("size")
    .insert([{ size_code }])
    .select()
    .single();
  if (error) {
    notification.error({
      message: "Lỗi thêm kích thước!",
      description: error.message,
      placement: "topRight",
    });
    return null;
  }
  return data;
};

// Cập nhật size
export const updateSize = async (
  size_id: string,
  size_code: string
): Promise<Size | null> => {
  const { data, error } = await supabase
    .from("size")
    .update({ size_code })
    .eq("size_id", size_id)
    .select()
    .single();
  if (error) {
    notification.error({
      message: "Lỗi cập nhật kích thước!",
      description: error.message,
      placement: "topRight",
    });
    return null;
  }
  return data;
};

// Xóa size
export const deleteSize = async (size_id: string): Promise<boolean> => {
  const { error } = await supabase.from("size").delete().eq("size_id", size_id);
  if (error) {
    notification.error({
      message: "Lỗi xóa kích thước!",
      description: error.message,
      placement: "topRight",
    });
    return false;
  }
  return true;
};
