export interface Product {
  product_id: string;
  product_code: string;
  brand_name: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  sale_price: number | null;
  discount: number;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  collections: Collection[];
  outfit: Outfit[];
  variants: ProductVariant[];
  variant_images: ProductImage[];
}

export interface ProductPreview {
  product_id: string;
  name: string;
  slug: string;
  colorCount: number;
  sizeCount: number;
  base_price: number;
  sale_price: number | null;
  discount: number | null;
  variant_images: ProductImage[];
}

export interface ProductVariant {
  variant_id: string;
  variant_code: string;
  product_id: string;
  image: ProductImage;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  quantity: number;
  color: Color;
  size: Size;
}

export interface ProductImage {
  image_id: string;
  image_url: string;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
}

export interface Outfit {
  outfit_id: string;
  outfit_name: string;
  image_url: string;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
}

export interface Color {
  color_id: string;
  color_name: string;
  color_code: string;
}

export interface Size {
  size_id: string;
  size_code: string;
}

export interface Collection {
  collection_id: string;
  name: string;
  slug: string;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
}
export const mockColors: Color[] = [
  { color_id: "1", color_name: "Đen", color_code: "#000000" },
  { color_id: "2", color_name: "Trắng", color_code: "#FFFFFF" },
  { color_id: "3", color_name: "Xanh Dương", color_code: "#0000FF" },
  { color_id: "4", color_name: "Đỏ", color_code: "#FF0000" },
];

export const mockSizes: Size[] = [
  { size_id: "1", size_code: "S" },
  { size_id: "2", size_code: "M" },
  { size_id: "3", size_code: "L" },
  { size_id: "4", size_code: "XL" },
];

export const mockProductImages: ProductImage[] = Array.from(
  { length: 20 },
  (_, index) => ({
    image_id: `img_${index + 1}`,
    image_url: `https://picsum.photos/seed/image${index + 1}/800/800`,
    created_at: new Date(),
    published_at: Math.random() > 0.5 ? new Date() : null,
    updated_at: new Date(),
  })
);

export const mockCollections: Collection[] = [
  {
    collection_id: "1",
    name: "Summer Collection",
    slug: "summer-collection",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    collection_id: "2",
    name: "Winter Collection",
    slug: "winter-collection",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
];

export const mockOutfits: Outfit[] = [
  {
    outfit_id: "1",
    outfit_name: "Outfit Trẻ Trung",
    image_url: "https://picsum.photos/seed/outfit1/600/852",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    outfit_id: "2",
    outfit_name: "Outfit Đi Chơi",
    image_url: "https://picsum.photos/seed/outfit2/600/852",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    outfit_id: "3",
    outfit_name: "Outfit Đi Chơi",
    image_url: "https://picsum.photos/seed/outfit2/600/852",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    outfit_id: "4",
    outfit_name: "Outfit Đi Chơi",
    image_url: "https://picsum.photos/seed/outfit2/600/852",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
  {
    outfit_id: "5",
    outfit_name: "Outfit Đi Chơi",
    image_url: "https://picsum.photos/seed/outfit2/600/852",
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
  },
];

export const mockProducts: Product[] = Array.from(
  { length: 20 },
  (_, index) => {
    const productId = `product_${index + 1}`;
    const productVariants: ProductVariant[] = [];

    // Tạo 10 biến thể cho mỗi sản phẩm
    for (let i = 0; i < 10; i++) {
      const color = mockColors[i % mockColors.length];
      const size = mockSizes[i % mockSizes.length];
      const image = mockProductImages[i % mockProductImages.length];

      productVariants.push({
        variant_id: `variant_${productId}_${i + 1}`,
        variant_code: `VAR_${productId}_${color.color_code}_${size.size_code}`,
        product_id: productId,
        image,
        created_at: new Date(),
        published_at: Math.random() > 0.5 ? new Date() : null,
        updated_at: new Date(),
        quantity: Math.floor(Math.random() * 100) + 1,
        color,
        size,
      });
    }

    return {
      product_id: productId,
      product_code: `CODE_${index + 1}`,
      brand_name: `Brand ${index + 1}`,
      name: `Product Name ${index + 1}`,
      slug: `product-name-${index + 1}`,
      description: `Description for product ${index + 1}`,
      base_price: 100000 * (index + 1),
      sale_price: Math.random() > 0.5 ? 90000 * (index + 1) : null,
      discount: Math.random() > 0.5 ? 10 * (index + 1) : 1 * (index + 1),
      created_at: new Date(),
      published_at: Math.random() > 0.5 ? new Date() : null,
      updated_at: new Date(),
      collections: [mockCollections[index % mockCollections.length]],
      outfit: [mockOutfits[index % mockOutfits.length]],
      variants: productVariants,
      variant_images: productVariants.map((variant) => variant.image),
    };
  }
);

export const mockProductPreviews: ProductPreview[] = mockProducts.map(
  (product) => ({
    product_id: product.product_id,
    name: product.name,
    slug: product.slug,
    colorCount: new Set(product.variants.map((v) => v.color.color_id)).size,
    sizeCount: new Set(product.variants.map((v) => v.size.size_id)).size,
    base_price: product.base_price,
    sale_price: product.sale_price,
    discount: product.discount,
    variant_images: shuffleArray(product.variant_images).slice(0, 3),
  })
);

// Hàm hoán đổi vị trí ngẫu nhiên
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
