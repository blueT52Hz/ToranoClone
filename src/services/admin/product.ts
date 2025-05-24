import { supabase } from "@/services/supabaseClient";
import { Product, ProductVariant } from "@/types/product.type";
import { notification } from "antd";
import { getVariantsByProductId } from "./product_variant";
import { getImagesByProductId } from "./gallery";
import { getCollectionsByProductId } from "./collection";
import { getOutfitsByProductId } from "./outfit";

export const addProduct = async (product: {
  name: string;
  slug: string;
  brand_name: string | "Torano";
  product_code: string;
  description?: string;
  base_price: number;
  sale_price?: number;
  discount: number;
  variants?: {
    image_id: string;
    size_id: string;
    color_id: string;
    quantity: number;
  }[];
  collectionsIds: string[];
  outfitIds: string[];
  imageIds: string[];
}): Promise<Product> => {
  // Bước 1: Thêm sản phẩm vào bảng product
  const { data: productData, error: productError } = await supabase
    .from("product")
    .insert([
      {
        name: product.name,
        slug: product.slug,
        brand_name: product.brand_name,
        product_code: product.product_code,
        description: product.description,
        base_price: product.base_price,
        sale_price: product.sale_price,
        discount: product.discount,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .select()
    .single(); // Chỉ lấy một bản ghi duy nhất

  if (productError) {
    throw productError;
  }

  if (!productData) {
    throw new Error("Failed to add product: No data returned from Supabase.");
  }

  const productId = productData.product_id;

  // Bước 2: Thêm các biến thể vào bảng product_variant
  if (product.variants && product.variants.length > 0) {
    const { error: variantError } = await supabase
      .from("product_variant")
      .insert(
        product.variants.map((variant) => ({
          product_id: productId,
          image_id: variant.image_id,
          size_id: variant.size_id,
          color_id: variant.color_id,
          quantity: variant.quantity,
          created_at: new Date(),
          updated_at: new Date(),
        })),
      );

    if (variantError) {
      throw variantError;
    }
  }

  // Bước 3: Thêm liên kết sản phẩm với bộ sưu tập vào bảng product_collection
  if (product.collectionsIds && product.collectionsIds.length > 0) {
    const { error: collectionError } = await supabase
      .from("product_collection")
      .insert(
        product.collectionsIds.map((collectionId) => ({
          product_id: productId,
          collection_id: collectionId,
        })),
      );

    if (collectionError) {
      throw collectionError;
    }
  }

  // Bước 4: Thêm liên kết sản phẩm với outfit vào bảng product_outfit
  if (product.outfitIds && product.outfitIds.length > 0) {
    const { error: outfitError } = await supabase.from("product_outfit").insert(
      product.outfitIds.map((outfitId) => ({
        product_id: productId,
        outfit_id: outfitId,
      })),
    );

    if (outfitError) {
      throw outfitError;
    }
  }

  // Bước 5: Thêm liên kết sản phẩm với hình ảnh vào bảng product_image
  if (product.imageIds && product.imageIds.length > 0) {
    const { error: imageError } = await supabase.from("product_image").insert(
      product.imageIds.map((imageId) => ({
        product_id: productId,
        image_id: imageId,
      })),
    );

    if (imageError) {
      throw imageError;
    }
  }

  // Trả về sản phẩm vừa được thêm
  return productData;
};

export const updateProductWithDetails = async (
  productId: string,
  updatedProduct: {
    name?: string;
    slug?: string;
    brand_name?: string;
    product_code?: string;
    description?: string;
    base_price?: number;
    sale_price?: number;
    discount?: number;
    variants?: {
      image_id: string;
      size_id: string;
      color_id: string;
      quantity: number;
    }[];
    collectionsIds?: string[];
    outfitIds?: string[];
    imageIds?: string[];
  },
): Promise<Product> => {
  const product = await updateProduct(productId, updatedProduct);
  return await getProductById(product.product_id);
};
// Cập nhật sản phẩm
export const updateProduct = async (
  productId: string,
  updatedProduct: {
    name?: string;
    slug?: string;
    brand_name?: string;
    product_code?: string;
    description?: string;
    base_price?: number;
    sale_price?: number;
    discount?: number;
    variants?: {
      image_id: string;
      size_id: string;
      color_id: string;
      quantity: number;
    }[];
    collectionsIds?: string[];
    outfitIds?: string[];
    imageIds?: string[];
  },
): Promise<Product> => {
  // Bước 1: Cập nhật thông tin sản phẩm trong bảng product
  const { data: productData, error: productError } = await supabase
    .from("product")
    .update({
      ...updatedProduct,
      updated_at: new Date(),
    })
    .eq("product_id", productId)
    .select()
    .single();

  if (productError) {
    throw productError;
  }

  if (!productData) {
    throw new Error(
      "Failed to update product: No data returned from Supabase.",
    );
  }

  // Bước 2: Cập nhật các biến thể trong bảng product_variant
  if (updatedProduct.variants && updatedProduct.variants.length > 0) {
    // Xóa các biến thể cũ
    await supabase.from("product_variant").delete().eq("product_id", productId);

    // Thêm các biến thể mới
    const { error: variantError } = await supabase
      .from("product_variant")
      .insert(
        updatedProduct.variants.map((variant) => ({
          product_id: productId,
          image_id: variant.image_id,
          size_id: variant.size_id,
          color_id: variant.color_id,
          quantity: variant.quantity,
          created_at: new Date(),
          updated_at: new Date(),
        })),
      );

    if (variantError) {
      throw variantError;
    }
  }

  // Bước 3: Cập nhật liên kết sản phẩm với bộ sưu tập trong bảng product_collection
  if (
    updatedProduct.collectionsIds &&
    updatedProduct.collectionsIds.length > 0
  ) {
    // Xóa các liên kết cũ
    await supabase
      .from("product_collection")
      .delete()
      .eq("product_id", productId);

    // Thêm các liên kết mới
    const { error: collectionError } = await supabase
      .from("product_collection")
      .insert(
        updatedProduct.collectionsIds.map((collectionId) => ({
          product_id: productId,
          collection_id: collectionId,
        })),
      );

    if (collectionError) {
      throw collectionError;
    }
  }

  // Bước 4: Cập nhật liên kết sản phẩm với outfit trong bảng product_outfit
  if (updatedProduct.outfitIds && updatedProduct.outfitIds.length > 0) {
    // Xóa các liên kết cũ
    await supabase.from("product_outfit").delete().eq("product_id", productId);

    // Thêm các liên kết mới
    const { error: outfitError } = await supabase.from("product_outfit").insert(
      updatedProduct.outfitIds.map((outfitId) => ({
        product_id: productId,
        outfit_id: outfitId,
      })),
    );

    if (outfitError) {
      throw outfitError;
    }
  }

  // Bước 5: Cập nhật liên kết sản phẩm với hình ảnh trong bảng product_image
  if (updatedProduct.imageIds && updatedProduct.imageIds.length > 0) {
    // Xóa các liên kết cũ
    await supabase.from("product_image").delete().eq("product_id", productId);

    // Thêm các liên kết mới
    const { error: imageError } = await supabase.from("product_image").insert(
      updatedProduct.imageIds.map((imageId) => ({
        product_id: productId,
        image_id: imageId,
      })),
    );

    if (imageError) {
      throw imageError;
    }
  }

  // Trả về sản phẩm vừa được cập nhật
  return productData;
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
    product.product_id,
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
    }),
  );

  return productsWithDetails;
};

export const getProductsByCollectionId = async (
  collectionId: string,
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
    }),
  );

  return productsWithDetails;
};

export const getProductsByOutfitId = async (
  outfitId: string,
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
    }),
  );

  return productsWithDetails;
};

export const getProductsByCollectionSlug = async (
  slug: string,
): Promise<Product[]> => {
  const { data: collection, error: collectionError } = await supabase
    .from("collection")
    .select("collection_id")
    .eq("slug", slug)
    .single();

  if (collectionError) {
    throw collectionError;
  }

  if (!collection) {
    return [];
  }

  const { data: productCollection, error: productCollectionError } =
    await supabase
      .from("product_collection")
      .select("product_id")
      .eq("collection_id", collection.collection_id);

  if (productCollectionError) {
    throw productCollectionError;
  }

  if (!productCollection || productCollection.length === 0) {
    return [];
  }

  const productIdArray = productCollection.map((item) => item.product_id);

  const { data: products, error: productsError } = await supabase
    .from("product")
    .select("*")
    .in("product_id", productIdArray);

  if (productsError) {
    throw productsError;
  }

  return products || [];
};
