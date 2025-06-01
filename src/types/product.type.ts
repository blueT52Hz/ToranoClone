import { Image } from "@/types/image.type";

export interface ProductPreview {
  image: {
    image_id: string;
    image_url: string;
  };
  product_id: string;
  product_name: string;
  product_code: string;
  base_price: number;
  sale_price: number | null;
  discount: number;
  product_status: "draft" | "published";
  quantity_total: number;
  quantity_min: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductForm {
  product_name: string;
  product_description: string;
  product_code: string;
  product_status: "draft" | "published";
  product_slug: string | null;
  base_price: number;
  sale_price: number | null;
  discount: number;
  brand_name: string;
  category_ids: string[];
  outfit_ids: string[];
  thumbnail_id: string;
  hover_id: string;
  image_ids: string[];
  variants: string[];
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
