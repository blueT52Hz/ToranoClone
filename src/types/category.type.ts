export interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image: {
    image_id: string;
    image_url: string;
    image_alt: string;
  };
}
