export interface Image {
  image_id: string;
  image_name: string;
  image_alt: string;
  image_url: string;
  image_status: "active" | "deleted";
  created_at: Date;
  updated_at: Date;
}
