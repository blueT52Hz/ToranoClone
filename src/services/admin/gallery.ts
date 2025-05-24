import { Image } from "@/types/product.type";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";
import { notification } from "antd";

const BUCKET_NAME = "images";
const TABLE_NAME = "product_image";

export const getGalleryImages = async (): Promise<Image[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    notification.error({
      message: "Lấy ảnh không thành công!",
      description: error.message,
      placement: "topRight",
    });
    throw error;
  }

  return (data || []).map((img) => ({
    ...img,
    created_at: new Date(img.created_at),
    updated_at: new Date(img.updated_at),
  }));
};

export const uploadImageToGallery = async (file: File): Promise<Image> => {
  try {
    // Generate a unique ID for the image
    const image_id = uuidv4();
    const fileExt = file.name.split(".").pop();
    const filePath = `${image_id}.${fileExt}`;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      notification.error({
        message: "Up ảnh không thành công!",
        description: `Upload failed: ${uploadError.message}`,
        placement: "topRight",
      });
      throw uploadError;
    }

    // Get the public URL for the image
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    // Add the image to the database
    const now = new Date();
    const newImage: any = {
      image_id,
      product_id: null,
      image_url: publicUrl,
      created_at: now,
      published_at: null,
      updated_at: now,
      image_name: file.name.replace(`.${fileExt}`, ""),
    };

    const { data, error: dbError } = await supabase
      .from(TABLE_NAME)
      .insert(newImage)
      .select()
      .single();

    if (dbError) {
      notification.error({
        message: "Up ảnh không thành công!",
        description: `Upload failed: ${dbError.message}`,
        placement: "topRight",
      });
      throw dbError;
    }

    notification.success({
      message: "Image uploaded successfully",
      placement: "topRight",
    });
    return {
      ...newImage,
    };
  } catch (error) {
    console.error("Error in uploadImageToGallery:", error);
    notification.error({
      message: "Up ảnh không thành công!",
      placement: "topRight",
    });
    throw error;
  }
};

// Update image name
export const updateImageName = async (
  image_id: string,
  newName: string,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        image_name: newName,
        updated_at: new Date(),
      })
      .eq("image_id", image_id);

    if (error) {
      notification.error({
        message: "Up ảnh không thành công!",
        description: `Upload failed: ${error.message}`,
        placement: "topRight",
      });
      throw error;
    }

    notification.success({
      message: "Image name updated successfully",
      placement: "topRight",
    });
  } catch (error) {
    console.error("Error in updateImageName:", error);
    throw error;
  }
};

// Delete an image from storage and database
export const removeFromGallery = async (image_id: string): Promise<void> => {
  try {
    // First get the image details to get the file path
    const { data: imageData, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("image_url")
      .eq("image_id", image_id)
      .single();

    if (fetchError) {
      notification.error({
        message: "Xóa ảnh không thành công!",
        description: `Remove failed: ${fetchError.message}`,
        placement: "topRight",
      });
      throw fetchError;
    }

    // Extract the file name from the URL
    const fileUrl = new URL(imageData.image_url);
    const pathParts = fileUrl.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (storageError) {
      console.error("Error removing from storage:", storageError);
      // Continue to remove from database even if storage removal fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("image_id", image_id);

    if (dbError) {
      notification.error({
        message: "Xóa ảnh không thành công!",
        description: `Remove failed: ${dbError.message}`,
        placement: "topRight",
      });
      throw dbError;
    }

    notification.success({
      message: "Image deleted successfully",
      placement: "topRight",
    });
  } catch (error) {
    console.error("Error in removeFromGallery:", error);
    throw error;
  }
};

export const getPaginatedGalleryImages = async (
  page: number,
  pageSize: number,
): Promise<{ images: Image[]; totalPages: number }> => {
  const {
    data: images,
    count: totalImages,
    error: countError,
  } = await supabase
    .from("product_image")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (countError) {
    throw countError;
  }

  // Tính toán tổng số trang
  const totalPages = Math.ceil((totalImages || 0) / pageSize);

  // Trả về kết quả
  return {
    images: images || [],
    totalPages,
  };
};

export const getImagesByProductId = async (
  productId: string,
): Promise<Image[]> => {
  const { data: images, error } = await supabase
    .from("product_image")
    .select("*")
    .eq("product_id", productId);

  if (error) {
    throw error;
  }

  return images || [];
};

export const getImageByImageId = async (imageId: string): Promise<Image> => {
  const { data: image, error } = await supabase
    .from("product_image")
    .select("*")
    .eq("image_id", imageId)
    .single(); // Sử dụng .single() để lấy một bản ghi duy nhất

  // Xử lý lỗi
  if (error) {
    console.error("Error fetching image:", error.message);
    throw error;
  }

  // Kiểm tra xem image có tồn tại không
  if (!image) {
    throw new Error(`Image with ID ${imageId} not found.`);
  }

  // Trả về ảnh
  return image;
};
