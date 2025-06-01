export interface VariantAdd {
  product_id: string;
  size_id: string;
  color_id: string;
  sku: string;
  status: "draft" | "published";
  quantity: number;
  image_ids: string[];
}
