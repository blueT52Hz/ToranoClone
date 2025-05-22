export interface Image {
  image_id: string;
  image_url: string;
  image_name: string;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
}
