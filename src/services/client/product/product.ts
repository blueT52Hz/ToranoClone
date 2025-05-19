import { supabase } from "@/services/supabaseClient";
import { Product } from "@/types/product";

export interface TopSellingProduct extends Product {
  totalSold: number;
}

export const getTopSellingProducts = async (): Promise<TopSellingProduct[]> => {
  try {
    const { data, error } = await supabase
      .from("order")
      .select(
        `
        cart:cart_id (
          cart_item (
            quantity,
            product_variant (
              product (
                product_id,
                name,
                description,
                base_price,
                sale_price,
                product_code,
                slug,
                brand_name,
                discount,
                created_at,
                updated_at,
                published_at,
                product_image (
                  image_url
                )
              )
            )
          )
        )
      `,
      )
      .eq("status", "completed");

    if (error) {
      throw error;
    }

    // Tính tổng số lượng bán của từng sản phẩm
    const productSales = new Map<
      string,
      { product: Product; totalSold: number }
    >();

    data?.forEach((order) => {
      order.cart?.cart_item?.forEach((item) => {
        if (item.product_variant?.product) {
          const productId = item.product_variant.product.product_id;
          const currentTotal = productSales.get(productId)?.totalSold || 0;

          productSales.set(productId, {
            product: {
              ...item.product_variant.product,
              images:
                item.product_variant.product.product_image?.map((img) => ({
                  url: img.image_url,
                })) || [],
            },
            totalSold: currentTotal + item.quantity,
          });
        }
      });
    });

    // Chuyển Map thành mảng và sắp xếp theo số lượng bán
    const sortedProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5) // Lấy 5 sản phẩm đầu tiên
      .map(({ product, totalSold }) => ({
        ...product,
        totalSold,
      }));

    return sortedProducts;
  } catch (error) {
    console.error("Error getting top selling products:", error);
    throw error;
  }
};
