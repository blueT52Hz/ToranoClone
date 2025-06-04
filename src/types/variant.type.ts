import { Image } from "@/types/image.type";

export interface VariantForm {
  size_id: string;
  color_id: string;
  status: "draft" | "published";
  quantity: number;
  images: Image[];
  created_at: Date;
  updated_at: Date;
}
