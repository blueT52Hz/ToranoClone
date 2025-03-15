import { getCollectionById } from "@/services/admin/collection";
import { supabase } from "@/services/supabaseClient";
import { Collection } from "@/types/product";

export const getPublishedCollectionsWithImage = async (): Promise<
  Collection[]
> => {
  // Truy vấn dữ liệu từ bảng `collection`
  const { data, error } = await supabase
    .from("collection")
    .select("collection_id") // Chọn tất cả các cột, hoặc bạn có thể chỉ định cụ thể như: .select('collection_id, name, description, slug, image_id')
    .not("published_at", "is", null) // Lọc các collection đã publish
    .not("image_id", "is", null); // Lọc các collection có ảnh

  if (error || !data || data.length === 0) {
    throw error;
  }

  const collections = Promise.all(
    data.map((item) => getCollectionById(item.collection_id))
  );

  // Trả về dữ liệu
  return collections || [];
};
