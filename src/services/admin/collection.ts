import { supabase } from "@/services/supabaseClient";
import { Collection, Product } from "@/types/product.type";
import { getImageByImageId } from "./gallery";

export const getCollectionById = async (
  collectionId: string,
): Promise<Collection> => {
  console.log(collectionId);

  const { data, error } = await supabase
    .from("collection")
    .select("*")
    .eq("collection_id", collectionId)
    .single();

  if (error) {
    throw error;
  }

  if (data.image_id) {
    const image = await getImageByImageId(data.image_id);
    return { ...data, image: image };
  }

  return data;
};

export const getCollectionsByProductId = async (
  productId: string,
): Promise<Collection[]> => {
  const { data: collectionIds, error: ollectionIdError } = await supabase
    .from("product_collection")
    .select("collection_id")
    .eq("product_id", productId);
  if (ollectionIdError) {
    throw ollectionIdError;
  }

  if (!collectionIds || collectionIds.length === 0) {
    return [];
  }
  const collectionIdArray = collectionIds.map((item) => item.collection_id);

  const { data: collections, error: collectionsError } = await supabase
    .from("collection")
    .select("*")
    .in("collection_id", collectionIdArray);

  if (collectionsError) {
    throw collectionsError;
  }

  return collections || [];
};

export const getCollectionBySlug = async (
  slug: string,
): Promise<Collection> => {
  const { data, error } = await supabase
    .from("collection")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw error;
  }
  return data || null;
};

export const getAllCollections = async (): Promise<Collection[]> => {
  const { data: collections, error } = await supabase
    .from("collection")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return collections || [];
};

export const addCollection = async (
  collection: {
    name: string;
    description?: string | null;
    slug: string;
    image_id?: string | null;
    published_at: Date | null;
  },
  productIds?: string[], // Danh sách product_id liên quan
): Promise<Collection> => {
  // Thêm trường created_at và updated_at vào collection
  const newCollection = {
    ...collection,
    image_id: collection.image_id,
    created_at: new Date(),
    updated_at: new Date(),
  };

  console.log(newCollection);

  // Thực hiện truy vấn insert để thêm collection
  const { data: collectionData, error: collectionError } = await supabase
    .from("collection")
    .insert([newCollection])
    .select() // Sử dụng .select() để lấy dữ liệu trả về
    .single(); // Chỉ lấy một bản ghi duy nhất

  // Xử lý lỗi khi thêm collection
  if (collectionError) {
    throw collectionError;
  }

  // Kiểm tra xem data có tồn tại không
  if (!collectionData) {
    throw new Error(
      "Failed to add collection: No data returned from Supabase.",
    );
  }

  // Nếu có productIds, thêm các bản ghi vào bảng product_collection
  if (productIds && productIds.length > 0) {
    const { error: productCollectionError } = await supabase
      .from("product_collection")
      .insert(
        productIds.map((productId) => ({
          collection_id: collectionData.collection_id,
          product_id: productId,
        })),
      );

    // Xử lý lỗi khi thêm vào bảng product_collection
    if (productCollectionError) {
      throw productCollectionError;
    }
  }

  // Trả về collection vừa được thêm
  return collectionData;
};

export const updateCollection = async (
  collectionId: string,
  updatedCollection: {
    name?: string;
    description?: string | null;
    slug?: string;
    image_id?: string | null;
    published_at: Date | null;
  },
  productIds?: string[], // Danh sách product_id liên quan
): Promise<Collection> => {
  console.log(productIds);

  // Thêm trường updated_at vào updatedCollection
  const newUpdatedCollection = {
    ...updatedCollection,
    updated_at: new Date(),
  };

  console.log(newUpdatedCollection);

  // Thực hiện truy vấn update để cập nhật thông tin collection
  const { data: collectionData, error: collectionError } = await supabase
    .from("collection")
    .update(newUpdatedCollection)
    .eq("collection_id", collectionId)
    .select() // Sử dụng .select() để lấy dữ liệu trả về
    .single(); // Chỉ lấy một bản ghi duy nhất

  // Xử lý lỗi khi cập nhật collection
  if (collectionError) {
    throw collectionError;
  }

  // Kiểm tra xem data có tồn tại không
  if (!collectionData) {
    throw new Error(
      "Failed to update collection: No data returned from Supabase.",
    );
  }

  // Nếu có productIds, cập nhật các bản ghi trong bảng product_collection
  if (productIds) {
    // 1. Xóa các liên kết cũ liên quan đến productIds
    const { error: deleteError } = await supabase
      .from("product_collection")
      .delete()
      .eq("collection_id", collectionId);

    if (deleteError) {
      throw new Error(`Lỗi khi xóa liên kết cũ: ${deleteError.message}`);
    }

    // 2. Thêm các liên kết mới vào bảng product_collection
    const { error: insertError } = await supabase
      .from("product_collection")
      .insert(
        productIds.map((productId) => ({
          collection_id: collectionId,
          product_id: productId,
        })),
      );

    if (insertError) {
      throw new Error(`Lỗi khi thêm liên kết mới: ${insertError.message}`);
    }

    console.log("Cập nhật liên kết thành công!");
  } else {
    console.log("Không có productIds để cập nhật.");
  }

  // Trả về collection vừa được cập nhật
  return collectionData;
};

export const deleteCollectionById = async (
  collectionId: string,
): Promise<boolean> => {
  // Bước 1: Xóa các bản ghi liên quan trong bảng product_collection
  const { error: productCollectionError } = await supabase
    .from("product_collection")
    .delete()
    .eq("collection_id", collectionId);

  if (productCollectionError) {
    throw productCollectionError;
  }

  // Bước 2: Xóa bộ sưu tập từ bảng collection
  const { error: collectionError } = await supabase
    .from("collection")
    .delete()
    .eq("collection_id", collectionId);

  if (collectionError) {
    throw collectionError;
  }

  console.log(`Collection with ID ${collectionId} deleted successfully.`);
  return true;
};
