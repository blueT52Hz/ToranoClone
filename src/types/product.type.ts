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
  discount: number | null;
  brand_name: string;
  category_ids: string[];
  outfit_ids: string[];
  thumbnail_id: string;
  hover_id: string;
  image_ids: string[];
  variants: {
    color_id: string;
    size_id: string;
    image_ids: string[];
    quantity: number;
    status: "draft" | "published";
  }[];
}

export interface ProductDetailAdmin {
  product_id: string;
  product_name: string;
  product_description: string;
  product_code: string;
  product_status: "draft" | "published";
  product_slug: string;
  base_price: number;
  sale_price: number | null;
  discount: number;
  brand_name: string;
  thumbnail: Image;
  hover: Image;
  category_ids: string[];
  images: Image[];
  variants: {
    color_id: string;
    size_id: string;
    image_ids: string[];
    quantity: number;
    images: Image[];
    status: "draft" | "published";
    created_at: Date;
    updated_at: Date;
  }[];
}

export interface HeroSection {
  image: Image;
  hero_name: string;
  hero_slug: string;
  hero_id: string;
}
