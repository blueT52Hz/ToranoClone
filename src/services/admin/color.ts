import { supabase } from "@/services/supabaseClient";
import { Color } from "@/types/product.type";
import { notification } from "antd";

export const addColor = async (color_name: string, color_code: string) => {
  const { data, error } = await supabase
    .from("color")
    .insert([{ color_name, color_code }])
    .select();

  if (error) {
    notification.error({
      message: "Lỗi thêm màu",
      description: error.message,
      placement: "topRight",
    });
    return;
  }
  notification.success({
    message: "Thêm màu thành công",
    placement: "topRight",
  });
  return data[0] as Color;
};

export const updateColor = async (
  color_id: string,
  color_name: string,
  color_code: string,
) => {
  const { data, error } = await supabase
    .from("color")
    .update({ color_name, color_code })
    .eq("color_id", color_id)
    .select();

  if (error) {
    notification.error({
      message: "Lỗi cập nhật màu",
      description: error.message,
      placement: "topRight",
    });
    return;
  }
  notification.success({
    message: "Cập nhật màu thành công",
    placement: "topRight",
  });
  return data[0] as Color;
};

export const deleteColor = async (color_id: string) => {
  const { data, error } = await supabase
    .from("color")
    .delete()
    .eq("color_id", color_id);

  if (error) {
    notification.error({
      message: "Lỗi xóa màu",
      description: error.message,
      placement: "topRight",
    });
  }
  notification.success({
    message: "Xóa màu thành công",
    placement: "topRight",
  });
  return data;
};

export const getAllColors = async (): Promise<Color[]> => {
  const { data, error } = await supabase.from("color").select("*");

  if (error) {
    notification.error({
      message: "Lỗi lấy tất cả màu",
      description: error.message,
      placement: "topRight",
    });
    return [];
  }
  return data as Color[];
};
