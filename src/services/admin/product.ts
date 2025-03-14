import { supabase } from "@/services/supabaseClient";
import {
  Collection,
  Image,
  Outfit,
  Product,
  ProductVariant,
} from "@/types/product";
import { notification } from "antd";
import { getVariantsByProductId } from "./product_variant";
import { getImagesByProductId } from "./gallery";
import { getCollectionsByProductId } from "./collection";
import { getOutfitsByProductId } from "./outfit";

export const addProduct = async (product: {
  brand_name: string | "Torano";
  name: string;
  description?: string;
  sale_price?: number;
  slug: string;
  product_code: string;
  base_price: number;
  discount: number;
}): Promise<Product> => {
  const newProduct = { ...product, created_at: new Date() };
  const { data, error } = await supabase
    .from("product")
    .insert([newProduct])
    .select();
  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error("Failed to add product: No data returned from Supabase.");
  }

  return data[0] as Product;
};

// Lấy sản phẩm theo ID
export const getProductById = async (productId: string): Promise<Product> => {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("product_id", productId)
    .single();

  if (error) {
    notification.error({
      message: "Lấy thông tin sản phẩm không thành công!" + ` id ${productId}`,
      description: error.message,
      placement: "topRight",
    });
    throw error;
  }

  const product = data;

  // Lấy các biến thể của sản phẩm
  const variants: ProductVariant[] = await getVariantsByProductId(
    product.product_id
  );

  // Lấy các ảnh của sản phẩm
  const images = await getImagesByProductId(product.product_id);

  // Lấy các collection của sản phẩm
  const collections = await getCollectionsByProductId(product.product_id);

  // Lấy các outfit của sản phẩm
  const outfits = await getOutfitsByProductId(product.product_id);

  return {
    ...product,
    created_at: new Date(product.created_at),
    updated_at: new Date(product.updated_at),
    variants: variants,
    variant_images: images,
    collections: collections,
    outfits: outfits,
  };
};

export const getAllProductsWithDetails = async (): Promise<Product[]> => {
  // Bước 1: Lấy tất cả sản phẩm từ bảng product
  const { data: products, error: productsError } = await supabase
    .from("product")
    .select("*");

  if (productsError) {
    throw productsError;
  }

  if (!products || products.length === 0) {
    return [];
  }

  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      const result = await getProductById(product.product_id);
      return result;
    })
  );

  return productsWithDetails;
};

export const addProductWithDetails = async (
  product: {
    brand_name: string | "Torano";
    name: string;
    description?: string;
    sale_price?: number;
    slug: string;
    product_code: string;
    base_price: number;
    discount: number;
  },
  images: Image[],
  collectionIds: string[],
  outfitIds: string[],
  variants: ProductVariant[]
) => {
  // Bước 1 tạo product trên database trước
  const productUploaded = await addProduct(product);
  if (!productUploaded) return;

  // Bước 2: Thêm các ảnh vào bảng product_image
  const imagesWithProductId = images.map((image) => ({
    ...image,
    product_id: productUploaded.product_id,
  }));

  const { error: imagesError } = await supabase
    .from("product_image")
    .insert(imagesWithProductId);

  if (imagesError) {
    throw imagesError;
  }

  // Bước 3: Thêm các collection vào bảng product_collection
  const collectionsWithProductId = collectionIds.map((collectionId) => ({
    product_id: productUploaded.product_id,
    collection_id: collectionId,
  }));

  const { error: collectionsError } = await supabase
    .from("product_collection")
    .insert(collectionsWithProductId);

  if (collectionsError) {
    throw collectionsError;
  }

  // Bước 4: Thêm các outfit vào bảng product_outfit
  const outfitsWithProductId = outfitIds.map((outfitId) => ({
    product_id: productUploaded.product_id,
    outfit_id: outfitId,
  }));

  const { error: outfitsError } = await supabase
    .from("product_outfit")
    .insert(outfitsWithProductId);

  if (outfitsError) {
    throw outfitsError;
  }

  // Bước 5: Thêm các biến thể vào bảng product_variant
  const variantsWithProductId = variants.map((variant) => ({
    ...variant,
    product_id: productUploaded.product_id,
  }));

  const { error: variantsError } = await supabase
    .from("product_variant")
    .insert(variantsWithProductId);

  if (variantsError) {
    throw variantsError;
  }

  return productUploaded;
};

export const getProductsByCollectionId = async (
  collectionId: string
): Promise<Product[]> => {
  const { data: productCollectionData, error: productCollectionError } =
    await supabase
      .from("product_collection")
      .select("product_id")
      .eq("collection_id", collectionId);

  if (productCollectionError) {
    throw productCollectionError;
  }

  const productIds = productCollectionData.map((item) => item.product_id);

  const productsWithDetails = await Promise.all(
    productIds.map(async (id) => {
      const result = await getProductById(id);
      return result;
    })
  );

  return productsWithDetails;
};

export const getProductsByOutfitId = async (
  outfitId: string
): Promise<Product[]> => {
  const { data: productOutfitData, error: productOutfitError } = await supabase
    .from("product_outfit")
    .select("product_id")
    .eq("outfit_id", outfitId);

  if (productOutfitError) {
    throw productOutfitError;
  }

  const productIds = productOutfitData.map((item) => item.product_id);

  const productsWithDetails = await Promise.all(
    productIds.map(async (id) => {
      const result = await getProductById(id);
      return result;
    })
  );

  return productsWithDetails;
};
