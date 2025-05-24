import { Image } from "@/types/product.type";
import { v4 as uuid } from "uuid";

// In a real app, this would handle actual file uploads to a server
// For demo purposes, we're using a local mock approach
export const uploadImage = (file: File): Promise<Image> => {
  return new Promise((resolve) => {
    // Generate a unique image name with UUID
    const fileName = file.name || "image";
    const fileNameWithoutExt = fileName.split(".")[0];
    const ext = fileName.split(".").pop() || "jpg";
    const uniqueImageName = `${fileNameWithoutExt}-${uuid()}.${ext}`;

    // Create an object URL (in a real app, this would be a server URL)
    const imageUrl = URL.createObjectURL(file);

    // Return the new image object
    setTimeout(() => {
      resolve({
        image_id: uuid(),
        image_url: imageUrl,
        image_name: uniqueImageName,
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
      });
    }, 500);
  });
};

export const getGalleryImages = (): Image[] => {
  return [...galleryImages];
};

export const getPaginatedGalleryImages = (
  page: number,
  pageSize: number,
  galleryImages: Image[],
): { images: Image[]; totalPages: number } => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const images = [...galleryImages].slice(start, end);
  const totalPages = Math.ceil(galleryImages.length / pageSize);
  return { images, totalPages };
};

export const addToGallery = (image: Image): void => {
  galleryImages = [image, ...galleryImages];
};

export const removeFromGallery = (imageId: string): void => {
  galleryImages = galleryImages.filter((image) => image.image_id !== imageId);
};

export const uploadImageToGallery = async (file: File): Promise<Image> => {
  const image = await uploadImage(file);
  addToGallery(image);
  return image;
};
