import { Product } from "@/types/product";
import { supabase } from "../supabaseClient";

// Hàm lấy tất cả sản phẩm theo collection_slug
export const getProductsByCollectionSlug = async (
  collectionSlug: string
): Promise<Product[]> => {
  // 1. Lấy thông tin collection dựa trên collection_slug
  const { data: collection, error: collectionError } = await supabase
    .from("collection")
    .select("collection_id")
    .eq("slug", collectionSlug)
    .single();

  if (collectionError || !collection) {
    throw new Error(`Không tìm thấy collection với slug: ${collectionSlug}`);
  }

  // 2. Lấy tất cả product_id thuộc collection đó từ bảng product_collection
  const { data: productCollections, error: productCollectionsError } =
    await supabase
      .from("product_collection")
      .select("product_id")
      .eq("collection_id", collection.collection_id);

  if (productCollectionsError) {
    throw new Error(
      `Lỗi khi lấy danh sách sản phẩm thuộc collection: ${productCollectionsError.message}`
    );
  }

  const productIds = productCollections.map((pc) => pc.product_id);

  // 3. Lấy thông tin chi tiết của từng sản phẩm từ bảng product
  const { data: products, error: productsError } = await supabase
    .from("product")
    .select("*")
    .in("product_id", productIds);

  if (productsError) {
    throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${productsError.message}`);
  }

  // 4. Lấy thông tin biến thể, ảnh, bộ sưu tập, và outfit liên quan đến từng sản phẩm
  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      // Lấy biến thể sản phẩm
      const { data: variants, error: variantsError } = await supabase
        .from("product_variant")
        .select("*")
        .eq("product_id", product.product_id);

      if (variantsError) {
        throw new Error(
          `Lỗi khi lấy biến thể sản phẩm: ${variantsError.message}`
        );
      }

      // Lấy thông tin chi tiết của từng biến thể
      const variantsWithDetails = await Promise.all(
        variants.map(async (variant) => {
          // Lấy thông tin ảnh của biến thể
          const { data: image, error: imageError } = await supabase
            .from("product_image")
            .select("*")
            .eq("image_id", variant.image_id)
            .single();

          if (imageError) {
            throw new Error(`Lỗi khi lấy ảnh biến thể: ${imageError.message}`);
          }

          // Lấy thông tin màu sắc
          const { data: color, error: colorError } = await supabase
            .from("color")
            .select("*")
            .eq("color_id", variant.color_id)
            .single();

          if (colorError) {
            throw new Error(
              `Lỗi khi lấy thông tin màu sắc: ${colorError.message}`
            );
          }

          // Lấy thông tin kích thước
          const { data: size, error: sizeError } = await supabase
            .from("size")
            .select("*")
            .eq("size_id", variant.size_id)
            .single();

          if (sizeError) {
            throw new Error(
              `Lỗi khi lấy thông tin kích thước: ${sizeError.message}`
            );
          }

          // Kết hợp thông tin biến thể
          return {
            ...variant,
            product: {
              name: product.name,
              product_id: product.product_id,
              base_price: product.base_price,
              sale_price: product.sale_price,
            },
            image,
            color,
            size,
          };
        })
      );

      // Lấy ảnh biến thể
      const { data: variantImages, error: variantImagesError } = await supabase
        .from("product_image")
        .select("*")
        .eq("product_id", product.product_id);

      if (variantImagesError) {
        throw new Error(
          `Lỗi khi lấy ảnh biến thể: ${variantImagesError.message}`
        );
      }

      // Lấy bộ sưu tập liên quan
      const { data: collections, error: collectionsError } = await supabase
        .from("product_collection")
        .select("collection_id")
        .eq("product_id", product.product_id);

      if (collectionsError) {
        throw new Error(`Lỗi khi lấy bộ sưu tập: ${collectionsError.message}`);
      }

      // Lấy thông tin chi tiết của từng bộ sưu tập
      const collectionDetails = await Promise.all(
        collections.map(async (col) => {
          const { data: collection, error: collectionError } = await supabase
            .from("collection")
            .select("*")
            .eq("collection_id", col.collection_id)
            .single();

          if (collectionError) {
            throw new Error(
              `Lỗi khi lấy thông tin bộ sưu tập: ${collectionError.message}`
            );
          }

          return {
            ...collection,
          };
        })
      );

      // Lấy outfit liên quan
      const { data: outfits, error: outfitsError } = await supabase
        .from("product_outfit")
        .select("outfit_id")
        .eq("product_id", product.product_id);

      if (outfitsError) {
        throw new Error(`Lỗi khi lấy outfit: ${outfitsError.message}`);
      }

      // Lấy thông tin chi tiết của từng outfit
      const outfitDetails = await Promise.all(
        outfits.map(async (outfit) => {
          const { data: outfitDetail, error: outfitError } = await supabase
            .from("outfit")
            .select("*")
            .eq("outfit_id", outfit.outfit_id)
            .single();

          if (outfitError) {
            throw new Error(
              `Lỗi khi lấy thông tin outfit: ${outfitError.message}`
            );
          }

          // Lấy ảnh của outfit
          const { data: outfitImage, error: outfitImageError } = await supabase
            .from("product_image")
            .select("*")
            .eq("image_id", outfitDetail.image_id)
            .single();

          if (outfitImageError) {
            throw new Error(
              `Lỗi khi lấy ảnh outfit: ${outfitImageError.message}`
            );
          }

          return {
            ...outfitDetail,
            image: outfitImage,
          };
        })
      );

      // Kết hợp thông tin và trả về sản phẩm đầy đủ
      return {
        ...product,
        variants: variantsWithDetails,
        variant_images: variantImages,
        collections: collectionDetails,
        outfits: outfitDetails,
      };
    })
  );

  return productsWithDetails;
};
