import { Outfit } from "@/types/product.type";
import { supabase } from "../supabaseClient";
import { getOutfitById } from "../admin/outfit";

export const getAllOutfits = async (): Promise<Outfit[]> => {
  const { data: outfits, error: outfitsError } = await supabase
    .from("outfit")
    .select("outfit_id")
    .not("published_at", "is", null) // Lọc các outfit đã publish
    .order("created_at", { ascending: false });

  if (outfitsError) {
    throw outfitsError;
  }

  if (!outfits || outfits.length === 0) {
    return [];
  }

  const outfitsWithImages = Promise.all(
    outfits.map((outfit) => getOutfitById(outfit.outfit_id)),
  );

  return outfitsWithImages;
};
