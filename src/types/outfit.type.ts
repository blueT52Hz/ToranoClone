import { Image } from "@/types/image.type";
import { ProductPreview } from "@/types/product.type";
export interface OutfitPreview {
  outfit_id: string;
  outfit_name: string;
  status: "publish" | "draft" | "archived";
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image: Image;
}

export interface OutfitWithProducts extends OutfitPreview {
  products: ProductPreview[];
}

export interface OutfitFormData {
  outfit_name: string;
  status: "publish" | "draft" | "archived";
  image_id: string;
  product_ids: string[];
}

export interface OutfitDetail {
  outfit_id: string;
  outfit_name: string;
  status: "publish" | "draft" | "archived";
  image: Image;
  products: ProductPreview[];
}
