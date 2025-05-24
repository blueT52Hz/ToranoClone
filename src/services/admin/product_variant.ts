import { supabase } from "@/services/supabaseClient";
import { ProductVariant } from "@/types/product.type";

export const getVariantsByProductId = async (
  productId: string,
): Promise<ProductVariant[]> => {
  // Bước 1: Lấy tất cả biến thể từ bảng product_variant dựa trên product_id
  const { data: variants, error: variantsError } = await supabase
    .from("product_variant")
    .select("*")
    .eq("product_id", productId);

  if (variantsError) {
    throw variantsError;
  }

  if (!variants || variants.length === 0) {
    return [];
  }

  // Bước 2: Với mỗi biến thể, lấy thông tin chi tiết
  const variantsWithDetails = await Promise.all(
    variants.map(async (variant) => {
      // Lấy thông tin sản phẩm
      const { data: product, error: productError } = await supabase
        .from("product")
        .select("name, product_id, base_price, sale_price")
        .eq("product_id", variant.product_id)
        .single();

      if (productError) {
        throw productError;
      }

      // Lấy thông tin ảnh
      const { data: image, error: imageError } = await supabase
        .from("product_image")
        .select("*")
        .eq("image_id", variant.image_id)
        .single();

      if (imageError) {
        throw imageError;
      }

      // Lấy thông tin màu sắc
      const { data: color, error: colorError } = await supabase
        .from("color")
        .select("*")
        .eq("color_id", variant.color_id)
        .single();

      if (colorError) {
        throw colorError;
      }

      // Lấy thông tin kích thước
      const { data: size, error: sizeError } = await supabase
        .from("size")
        .select("*")
        .eq("size_id", variant.size_id)
        .single();

      if (sizeError) {
        throw sizeError;
      }

      // Trả về biến thể với thông tin chi tiết
      return {
        variant_id: variant.variant_id,
        variant_code: variant.variant_code,
        product: {
          name: product.name,
          product_id: product.product_id,
          base_price: product.base_price,
          sale_price: product.sale_price,
        },
        image: {
          image_id: image.image_id,
          image_url: image.image_url,
          image_name: image.image_name,
          created_at: new Date(image.created_at),
          published_at: image.published_at
            ? new Date(image.published_at)
            : null,
          updated_at: new Date(image.updated_at),
        },
        created_at: new Date(variant.created_at),
        published_at: variant.published_at
          ? new Date(variant.published_at)
          : null,
        updated_at: new Date(variant.updated_at),
        quantity: variant.quantity,
        color: {
          color_id: color.color_id,
          color_name: color.color_name,
          color_code: color.color_code,
        },
        size: {
          size_id: size.size_id,
          size_code: size.size_code,
        },
      };
    }),
  );

  return variantsWithDetails;
};

export const upVariantByProductId = async (variant: {
  product_id: string;
  image_id: string;
  size_id: string;
  color_id: string;
  quantity: number;
  variant_code: string;
}): Promise<ProductVariant> => {
  const { data, error } = await supabase
    .from("product_variant")
    .insert([variant])
    .select();

  if (error) throw error;

  if (!data || data.length === 0) throw error;

  return data[0];
};
