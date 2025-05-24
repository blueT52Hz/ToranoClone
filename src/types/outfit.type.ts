import { Image } from "@/types/image.type";
import { Product } from "@/types/product";
export interface OutfitPreview {
  outfit_id: string;
  outfit_name: string;
  status: "published" | "draft" | "archived";
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image: Image;
}

export interface OutfitWithProducts extends OutfitPreview {
  products: Product[];
}

export interface Outfit {
  outfit_id: string;
  outfit_name: string;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image: Image;
}
