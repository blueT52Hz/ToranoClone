import { supabase } from "@/services/supabaseClient";
import { Outfit } from "@/types/product";
import { getImageByImageId } from "./gallery";

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

  if (!outfitData) throw Error;

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

export const addOutfit = async (
  outfit: {
    outfit_name: string;
    image_id: string;
    published_at: Date | null;
  },
  productIds?: string[] // Danh sách product_id liên quan
): Promise<Outfit> => {
  // Thêm trường created_at và updated_at vào outfit
  const newOutfit = {
    ...outfit,
    created_at: new Date(),
    updated_at: new Date(),
  };

  console.log(newOutfit);

  // Thực hiện truy vấn insert để thêm outfit
  const { data: outfitData, error: outfitError } = await supabase
    .from("outfit")
    .insert([newOutfit])
    .select() // Sử dụng .select() để lấy dữ liệu trả về
    .single(); // Chỉ lấy một bản ghi duy nhất

  // Xử lý lỗi khi thêm outfit
  if (outfitError) {
    throw outfitError;
  }

  // Kiểm tra xem data có tồn tại không
  if (!outfitData) {
    throw new Error("Failed to add outfit: No data returned from Supabase.");
  }

  // Nếu có productIds, thêm các bản ghi vào bảng product_outfit
  if (productIds && productIds.length > 0) {
    const { error: productOutfitError } = await supabase
      .from("product_outfit")
      .insert(
        productIds.map((productId) => ({
          outfit_id: outfitData.outfit_id,
          product_id: productId,
        }))
      );

    // Xử lý lỗi khi thêm vào bảng product_outfit
    if (productOutfitError) {
      throw productOutfitError;
    }
  }

  // Trả về outfit vừa được thêm
  return outfitData;
};

export const getAllOutfits = async (): Promise<Outfit[]> => {
  const { data: outfits, error: outfitsError } = await supabase
    .from("outfit")
    .select("outfit_id")
    .order("created_at", { ascending: false });

  if (outfitsError) {
    throw outfitsError;
  }

  if (!outfits || outfits.length === 0) {
    return [];
  }

  const outfitsWithImages = Promise.all(
    outfits.map((outfit) => getOutfitById(outfit.outfit_id))
  );

  return outfitsWithImages;
};

export const updateOutfit = async (
  outfitId: string,
  updatedOutfit: {
    outfit_name?: string;
    image_id?: string | null;
    published_at: Date | null;
  },
  productIds?: string[] // Danh sách product_id liên quan
): Promise<Outfit> => {
  // Thêm trường updated_at vào updatedOutfit
  const newUpdatedOutfit = {
    ...updatedOutfit,
    updated_at: new Date(),
  };

  console.log(newUpdatedOutfit);

  // Thực hiện truy vấn update để cập nhật thông tin outfit
  const { data: outfitData, error: outfitError } = await supabase
    .from("outfit")
    .update(newUpdatedOutfit)
    .eq("outfit_id", outfitId)
    .select() // Sử dụng .select() để lấy dữ liệu trả về
    .single(); // Chỉ lấy một bản ghi duy nhất

  // Xử lý lỗi khi cập nhật outfit
  if (outfitError) {
    throw outfitError;
  }

  // Kiểm tra xem data có tồn tại không
  if (!outfitData) {
    throw new Error("Failed to update outfit: No data returned from Supabase.");
  }

  // Nếu có productIds, cập nhật các bản ghi trong bảng product_outfit
  if (productIds && productIds.length > 0) {
    // Bước 1: Lấy danh sách các sản phẩm hiện tại trong outfit
    const { data: currentProductOutfit, error: fetchError } = await supabase
      .from("product_outfit")
      .select("product_id")
      .eq("outfit_id", outfitId);

    if (fetchError) {
      throw fetchError;
    }

    // Bước 2: Xác định các sản phẩm cần xóa (có trong hiện tại nhưng không có trong productIds)
    const currentProductIds = currentProductOutfit.map(
      (item) => item.product_id
    );
    const productsToDelete = currentProductIds.filter(
      (productId) => !productIds.includes(productId)
    );

    // Bước 3: Xóa các sản phẩm không có trong productIds
    if (productsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("product_outfit")
        .delete()
        .eq("outfit_id", outfitId)
        .in("product_id", productsToDelete);

      if (deleteError) {
        throw deleteError;
      }
    }

    // Bước 4: Thêm các liên kết mới vào bảng product_outfit
    const { error: insertError } = await supabase.from("product_outfit").insert(
      productIds.map((productId) => ({
        outfit_id: outfitId,
        product_id: productId,
      }))
    );

    // Xử lý lỗi khi thêm vào bảng product_outfit
    if (insertError) {
      throw insertError;
    }
  } else {
    // Nếu productIds rỗng, xóa tất cả các sản phẩm liên quan đến outfit này
    const { error: deleteAllError } = await supabase
      .from("product_outfit")
      .delete()
      .eq("outfit_id", outfitId);

    if (deleteAllError) {
      throw deleteAllError;
    }
  }

  // Trả về outfit vừa được cập nhật
  return outfitData;
};
