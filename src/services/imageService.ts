import { ProductImage } from "@/types/product";
import {v4 as uuid} from "uuid";

// In a real app, this would handle actual file uploads to a server
// For demo purposes, we're using a local mock approach
export const uploadImage = (file: File): Promise<ProductImage> => {
  return new Promise((resolve) => {
    // Generate a unique image name with UUID
    const fileName = file.name || 'image';
    const fileNameWithoutExt = fileName.split('.')[0];
    const ext = fileName.split('.').pop() || 'jpg';
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
        updated_at: new Date()
      });
    }, 500);
  });
};

// Simulated image gallery storage
let galleryImages: ProductImage[] = [
  {
    image_id: "1",
    image_url: "/placeholder.svg",
    image_name: "placeholder-1.jpg",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    image_id: "2",
    image_url: "/placeholder.svg",
    image_name: "placeholder-2.jpg",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    image_id: "3",
    image_url: "/placeholder.svg",
    image_name: "placeholder-3.jpg",
    created_at: new Date(Date.now() - 86400000), // 1 day ago
    published_at: null,
    updated_at: new Date(),
  },
  {
    image_id: "4",
    image_url: "/placeholder.svg",
    image_name: "placeholder-4.jpg",
    created_at: new Date(Date.now() - 172800000), // 2 days ago
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    image_id: "5",
    image_url: "/placeholder.svg",
    image_name: "placeholder-5.jpg",
    created_at: new Date(Date.now() - 259200000), // 3 days ago
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    image_id: "6",
    image_url: "/placeholder.svg",
    image_name: "placeholder-6.jpg",
    created_at: new Date(Date.now() - 345600000), // 4 days ago
    published_at: new Date(),
    updated_at: new Date(),
  },
  // Generate more images for pagination demo
  ...[...Array(14)].map((_, i) => ({
    image_id: (i + 7).toString(),
    image_url: "/placeholder.svg",
    image_name: `placeholder-${i + 7}.jpg`,
    created_at: new Date(Date.now() - (432000000 + i * 86400000)), // 5+ days ago
    published_at: i % 3 === 0 ? null : new Date(),
    updated_at: new Date(),
  }))
];

export const getGalleryImages = (): ProductImage[] => {
  return [...galleryImages];
};

export const getPaginatedGalleryImages = (page: number, pageSize: number): { images: ProductImage[], totalPages: number } => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const images = [...galleryImages].slice(start, end);
  const totalPages = Math.ceil(galleryImages.length / pageSize);
  return { images, totalPages };
};

export const addToGallery = (image: ProductImage): void => {
  galleryImages = [image, ...galleryImages];
};

export const removeFromGallery = (imageId: string): void => {
  galleryImages = galleryImages.filter(image => image.image_id !== imageId);
};

export const uploadImageToGallery = async (file: File): Promise<ProductImage> => {
  const image = await uploadImage(file);
  addToGallery(image);
  return image;
};
