import { supabase } from "@/services/supabaseClient";
import { Outfit } from "@/types/product";
import { getImageByImageId } from "./gallery";
import { error } from "console";

export const getOutfitsByProductId = async (
  productId: string
): Promise<Outfit[]> => {
  const { data: productOutfits, error: productOutfitsError } = await supabase
    .from("product_outfit")
    .select("outfit_id")
    .eq("product_id", productId);

  if (productOutfitsError) {
    throw productOutfitsError;
  }

  if (!productOutfits || productOutfits.length === 0) {
    return [];
  }

  const outfitIdArray = productOutfits.map((item) => item.outfit_id);

  const { data: outfits, error: outfitsError } = await supabase
    .from("outfit")
    .select("*")
    .in("outfit_id", outfitIdArray);

  if (outfitsError) {
    throw outfitsError;
  }

  return outfits || [];
};

export const getOutfitById = async (outfitId: string): Promise<Outfit> => {
  // Bước 1: Lấy thông tin outfit từ bảng outfit
  const { data: outfitData, error: outfitError } = await supabase
    .from("outfit")
    .select("*")
    .eq("outfit_id", outfitId)
    .single(); // Sử dụng .single() vì chỉ có một bản ghi

  if (outfitError) {
    throw outfitError;
  }

  const image = await getImageByImageId(outfitData.image_id);

  if (!outfitData) throw error;

  // Bước 3: Kết hợp dữ liệu
  const outfit: Outfit = {
    outfit_id: outfitData.outfit_id,
    outfit_name: outfitData.outfit_name,
    image: image,
    created_at: new Date(outfitData.created_at),
    published_at: outfitData.published_at
      ? new Date(outfitData.published_at)
      : null,
    updated_at: new Date(outfitData.updated_at),
  };

  return outfit;
};
