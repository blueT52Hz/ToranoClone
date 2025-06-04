export interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  status: "draft" | "published" | "archived";
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  image: {
    image_id: string;
    image_url: string;
    image_alt: string;
  };
}

export interface CategoryFormData {
  category_id: string;
  category_name: string;
  category_slug: string;
  status: "draft" | "published" | "archived";
  image: {
    image_id: string;
    image_url: string;
    image_alt: string;
  };
}

export interface CategoryProduct {
  category_id: string;
  created_at: Date;
  category_name: string;
}
