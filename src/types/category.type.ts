import { Image } from "@/types/image.type";
import { ProductPreview } from "@/types/product.type";

export interface CategoryPreview {
  category_id: string;
  category_name: string;
  category_slug: string;
  status: "draft" | "publish" | "archived";
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image: Image;
}

export interface CategoryFormData {
  category_name: string;
  category_slug: string;
  status: "draft" | "publish" | "archived";
  product_ids: string[];
  image_id: string;
}

export interface CategoryDetail {
  category_id: string;
  category_name: string;
  category_slug: string;
  status: "draft" | "publish" | "archived";
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image?: Image;
  products: ProductPreview[];
}

export interface CategoryProduct {
  category_id: string;
  created_at: Date;
  category_name: string;
}
