import { Image } from "@/types/image.type";
export interface Product {
  product_id: string;
  product_code: string;
  brand_name: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  sale_price: number | null;
  discount: number;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  variants: ProductVariant[];
  variant_images: Image[];
  collections: Collection[];
  outfits: Outfit[];
}

export interface ProductVariant {
  variant_id: string;
  variant_code: string;
  product: Pick<Product, "name" | "product_id" | "base_price" | "sale_price">;
  image: Image;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  quantity: number;
  color: Color;
  size: Size;
}

export interface Outfit {
  outfit_id: string;
  outfit_name: string;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image: Image;
}

export interface Color {
  color_id: string;
  color_name: string;
  color_code: string;
  created_at: Date;
  updated_at: Date;
}

export interface Size {
  size_id: string;
  size_code: string;
  created_at: Date;
  updated_at: Date;
}

export interface FormErrors {
  name?: string;
  slug?: string;
  product_code?: string;
  base_price?: string;
  sale_price?: string;
  variants?: {
    [key: number]: { color?: string; size?: string; quantity?: string };
  };
}

export interface HeroSection {
  image: Image;
  hero_name: string;
  hero_slug: string;
  hero_id: string;
}
