import {
  Collection,
  Image,
  Outfit,
  Product,
  ProductVariant,
} from "@/types/product";
import { supabase } from "../supabaseClient";

// Hàm lấy tất cả sản phẩm theo collection_slug
export const getProductsByCollectionSlug = async (
  collectionSlug: string
): Promise<Product[]> => {
  if (collectionSlug === "all") {
    return await getPublishedProducts();
  }
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

  // 4. Lấy thông tin biến thể, ảnh, bộ sưu tập, và outfit liên quan đến từng sản phẩm
  const productsWithDetails = await Promise.all(
    productIds.map(async (productId) => {
      return await getProductByProductId(productId);
    })
  );

  return productsWithDetails;
};

export const getProductByProductSlug = async (
  slug: string
): Promise<Product> => {
  // Lấy thông tin sản phẩm dựa trên slug
  const { data: productData, error: productError } = await supabase
    .from("product")
    .select()
    .eq("slug", slug)
    .single();

  if (productError) {
    throw productError;
  }

  // Lấy danh sách các biến thể (variants) của sản phẩm
  const { data: variantsData, error: variantsError } = await supabase
    .from("product_variant")
    .select()
    .eq("product_id", productData.product_id);
  if (variantsError) throw variantsError;

  // Lấy danh sách hình ảnh của sản phẩm
  const { data: imagesData, error: imagesError } = await supabase
    .from("product_image")
    .select()
    .eq("product_id", productData.product_id);
  if (imagesError) throw imagesError;

  // Lấy danh sách các bộ sưu tập (collections) của sản phẩm
  const { data: collectionsData, error: collectionsError } = await supabase
    .from("product_collection")
    .select()
    .eq("product_id", productData.product_id);
  if (collectionsError) throw collectionsError;

  // Lấy danh sách các outfit của sản phẩm
  const { data: outfitsData, error: outfitsError } = await supabase
    .from("product_outfit")
    .select()
    .eq("product_id", productData.product_id);
  if (outfitsError) throw outfitsError;

  // Xử lý thông tin các biến thể (variants)
  const variants: ProductVariant[] = await Promise.all(
    variantsData.map(async (variantData): Promise<ProductVariant> => {
      // Lấy thông tin màu sắc (color)
      const { data: colorData, error: colorError } = await supabase
        .from("color")
        .select()
        .eq("color_id", variantData.color_id)
        .single();
      if (colorError) throw colorError;

      // Lấy thông tin kích thước (size)
      const { data: sizeData, error: sizeError } = await supabase
        .from("size")
        .select()
        .eq("size_id", variantData.size_id)
        .single();
      if (sizeError) throw sizeError;

      // Lấy thông tin hình ảnh của biến thể (image)
      const { data: imageData, error: imageError } = await supabase
        .from("product_image")
        .select()
        .eq("image_id", variantData.image_id)
        .single();
      if (imageError) throw imageError;

      // Trả về thông tin biến thể hoàn chỉnh
      return {
        variant_id: variantData.variant_id,
        variant_code: variantData.variant_code,
        product: {
          product_id: productData.product_id,
          base_price: productData.base_price,
          sale_price: productData.sale_price,
          name: productData.name,
        },
        image: {
          image_id: imageData.image_id,
          image_url: imageData.image_url,
          image_name: imageData.image_name,
          created_at: new Date(imageData.created_at),
          published_at: imageData.published_at
            ? new Date(imageData.published_at)
            : null,
          updated_at: new Date(imageData.updated_at),
        },
        color: {
          color_id: colorData.color_id,
          color_name: colorData.color_name,
          color_code: colorData.color_code,
        },
        size: {
          size_id: sizeData.size_id,
          size_code: sizeData.size_code,
        },
        quantity: variantData.quantity,
        created_at: new Date(variantData.created_at),
        published_at: variantData.published_at
          ? new Date(variantData.published_at)
          : null,
        updated_at: new Date(variantData.updated_at),
      };
    })
  );

  // Xử lý thông tin hình ảnh (images)
  const images: Image[] = imagesData.map((imageData) => ({
    image_id: imageData.image_id,
    image_url: imageData.image_url,
    image_name: imageData.image_name,
    created_at: new Date(imageData.created_at),
    published_at: imageData.published_at
      ? new Date(imageData.published_at)
      : null,
    updated_at: new Date(imageData.updated_at),
  }));

  // Xử lý thông tin bộ sưu tập (collections)
  const collections: Collection[] = await Promise.all(
    collectionsData.map(async (collectionData) => {
      const { data: collectionInfo, error: collectionInfoError } =
        await supabase
          .from("collection")
          .select()
          .eq("collection_id", collectionData.collection_id)
          .single();
      if (collectionInfoError) throw collectionInfoError;

      return {
        collection_id: collectionInfo.collection_id,
        name: collectionInfo.name,
        slug: collectionInfo.slug,
        created_at: new Date(collectionInfo.created_at),
        published_at: collectionInfo.published_at
          ? new Date(collectionInfo.published_at)
          : null,
        updated_at: new Date(collectionInfo.updated_at),
        image: {
          image_id: collectionInfo.image_id,
          image_url: collectionInfo.image_url,
          image_name: collectionInfo.image_name,
          created_at: new Date(collectionInfo.created_at),
          published_at: collectionInfo.published_at
            ? new Date(collectionInfo.published_at)
            : null,
          updated_at: new Date(collectionInfo.updated_at),
        },
      };
    })
  );

  // Xử lý thông tin outfit
  const outfits: Outfit[] = await Promise.all(
    outfitsData.map(async (outfitData) => {
      const { data: outfitInfo, error: outfitInfoError } = await supabase
        .from("outfit")
        .select()
        .eq("outfit_id", outfitData.outfit_id)
        .single();
      if (outfitInfoError) throw outfitInfoError;

      return {
        outfit_id: outfitInfo.outfit_id,
        outfit_name: outfitInfo.outfit_name,
        created_at: new Date(outfitInfo.created_at),
        published_at: outfitInfo.published_at
          ? new Date(outfitInfo.published_at)
          : null,
        updated_at: new Date(outfitInfo.updated_at),
        image: {
          image_id: outfitInfo.image_id,
          image_url: outfitInfo.image_url,
          image_name: outfitInfo.image_name,
          created_at: new Date(outfitInfo.created_at),
          published_at: outfitInfo.published_at
            ? new Date(outfitInfo.published_at)
            : null,
          updated_at: new Date(outfitInfo.updated_at),
        },
      };
    })
  );

  // Trả về đối tượng Product hoàn chỉnh
  return {
    ...productData,
    variants,
    variant_images: images,
    collections,
    outfits,
  };
};

export const getProductByProductId = async (
  product_id: string
): Promise<Product> => {
  // Lấy thông tin sản phẩm dựa trên slug
  const { data: productData, error: productError } = await supabase
    .from("product")
    .select()
    .eq("product_id", product_id)
    .single();

  if (productError) {
    throw productError;
  }

  // Lấy danh sách các biến thể (variants) của sản phẩm
  const { data: variantsData, error: variantsError } = await supabase
    .from("product_variant")
    .select()
    .eq("product_id", productData.product_id);
  if (variantsError) throw variantsError;

  // Lấy danh sách hình ảnh của sản phẩm
  const { data: imagesData, error: imagesError } = await supabase
    .from("product_image")
    .select()
    .eq("product_id", productData.product_id);
  if (imagesError) throw imagesError;

  // Lấy danh sách các bộ sưu tập (collections) của sản phẩm
  const { data: collectionsData, error: collectionsError } = await supabase
    .from("product_collection")
    .select()
    .eq("product_id", productData.product_id);
  if (collectionsError) throw collectionsError;

  // Lấy danh sách các outfit của sản phẩm
  const { data: outfitsData, error: outfitsError } = await supabase
    .from("product_outfit")
    .select()
    .eq("product_id", productData.product_id);
  if (outfitsError) throw outfitsError;

  // Xử lý thông tin các biến thể (variants)
  const variants: ProductVariant[] = await Promise.all(
    variantsData.map(async (variantData): Promise<ProductVariant> => {
      // Lấy thông tin màu sắc (color)
      const { data: colorData, error: colorError } = await supabase
        .from("color")
        .select()
        .eq("color_id", variantData.color_id)
        .single();
      if (colorError) throw colorError;

      // Lấy thông tin kích thước (size)
      const { data: sizeData, error: sizeError } = await supabase
        .from("size")
        .select()
        .eq("size_id", variantData.size_id)
        .single();
      if (sizeError) throw sizeError;

      // Lấy thông tin hình ảnh của biến thể (image)
      const { data: imageData, error: imageError } = await supabase
        .from("product_image")
        .select()
        .eq("image_id", variantData.image_id)
        .single();
      if (imageError) throw imageError;

      // Trả về thông tin biến thể hoàn chỉnh
      return {
        variant_id: variantData.variant_id,
        variant_code: variantData.variant_code,
        product: {
          product_id: productData.product_id,
          base_price: productData.base_price,
          sale_price: productData.sale_price,
          name: productData.name,
        },
        image: {
          image_id: imageData.image_id,
          image_url: imageData.image_url,
          image_name: imageData.image_name,
          created_at: new Date(imageData.created_at),
          published_at: imageData.published_at
            ? new Date(imageData.published_at)
            : null,
          updated_at: new Date(imageData.updated_at),
        },
        color: {
          color_id: colorData.color_id,
          color_name: colorData.color_name,
          color_code: colorData.color_code,
        },
        size: {
          size_id: sizeData.size_id,
          size_code: sizeData.size_code,
        },
        quantity: variantData.quantity,
        created_at: new Date(variantData.created_at),
        published_at: variantData.published_at
          ? new Date(variantData.published_at)
          : null,
        updated_at: new Date(variantData.updated_at),
      };
    })
  );

  // Xử lý thông tin hình ảnh (images)
  const images: Image[] = imagesData.map((imageData) => ({
    image_id: imageData.image_id,
    image_url: imageData.image_url,
    image_name: imageData.image_name,
    created_at: new Date(imageData.created_at),
    published_at: imageData.published_at
      ? new Date(imageData.published_at)
      : null,
    updated_at: new Date(imageData.updated_at),
  }));

  // Xử lý thông tin bộ sưu tập (collections)
  const collections: Collection[] = await Promise.all(
    collectionsData.map(async (collectionData) => {
      const { data: collectionInfo, error: collectionInfoError } =
        await supabase
          .from("collection")
          .select()
          .eq("collection_id", collectionData.collection_id)
          .single();
      if (collectionInfoError) throw collectionInfoError;

      return {
        collection_id: collectionInfo.collection_id,
        name: collectionInfo.name,
        slug: collectionInfo.slug,
        created_at: new Date(collectionInfo.created_at),
        published_at: collectionInfo.published_at
          ? new Date(collectionInfo.published_at)
          : null,
        updated_at: new Date(collectionInfo.updated_at),
        image: {
          image_id: collectionInfo.image_id,
          image_url: collectionInfo.image_url,
          image_name: collectionInfo.image_name,
          created_at: new Date(collectionInfo.created_at),
          published_at: collectionInfo.published_at
            ? new Date(collectionInfo.published_at)
            : null,
          updated_at: new Date(collectionInfo.updated_at),
        },
      };
    })
  );

  // Xử lý thông tin outfit
  const outfits: Outfit[] = await Promise.all(
    outfitsData.map(async (outfitData) => {
      const { data: outfitInfo, error: outfitInfoError } = await supabase
        .from("outfit")
        .select()
        .eq("outfit_id", outfitData.outfit_id)
        .single();
      if (outfitInfoError) throw outfitInfoError;

      return {
        outfit_id: outfitInfo.outfit_id,
        outfit_name: outfitInfo.outfit_name,
        created_at: new Date(outfitInfo.created_at),
        published_at: outfitInfo.published_at
          ? new Date(outfitInfo.published_at)
          : null,
        updated_at: new Date(outfitInfo.updated_at),
        image: {
          image_id: outfitInfo.image_id,
          image_url: outfitInfo.image_url,
          image_name: outfitInfo.image_name,
          created_at: new Date(outfitInfo.created_at),
          published_at: outfitInfo.published_at
            ? new Date(outfitInfo.published_at)
            : null,
          updated_at: new Date(outfitInfo.updated_at),
        },
      };
    })
  );

  // Trả về đối tượng Product hoàn chỉnh
  return {
    ...productData,
    variants,
    variant_images: images,
    collections,
    outfits,
  };
};

export const getPublishedProducts = async (): Promise<Product[]> => {
  // Truy vấn tất cả sản phẩm đã publish và sắp xếp theo ngày đăng mới nhất
  const { data: products, error } = await supabase
    .from("product")
    .select("*")
    .not("published_at", "is", null) // Sử dụng "is" để kiểm tra null
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
  }

  // Nếu không có sản phẩm nào, trả về mảng rỗng
  if (!products || products.length === 0) {
    return [];
  }

  // Lấy thông tin chi tiết cho từng sản phẩm (variants, images, collections, outfits)
  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      return await getProductByProductId(product.product_id);
    })
  );

  return productsWithDetails;
};
