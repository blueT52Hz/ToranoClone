import { supabase } from "@/services/supabaseClient";
import { Product } from "@/types/product";

export const getTopSellingProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("order")
      .select(
        `
        cart_id,
        cart:cart_id (
          cartItems:cart_item (
            variant:variant_id (
              product:product_id (
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
                published_at
              )
            ),
            quantity
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
      { product: Product; totalQuantity: number }
    >();

    data?.forEach((order) => {
      order.cart?.cartItems?.forEach((item) => {
        if (item.variant?.product) {
          const productId = item.variant.product.product_id;
          const currentTotal = productSales.get(productId)?.totalQuantity || 0;

          productSales.set(productId, {
            product: item.variant.product,
            totalQuantity: currentTotal + item.quantity,
          });
        }
      });
    });

    // Chuyển Map thành mảng và sắp xếp theo số lượng bán
    const sortedProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5) // Lấy 5 sản phẩm đầu tiên
      .map((item) => item.product);

    return sortedProducts;
  } catch (error) {
    console.error("Error getting top selling products:", error);
    throw error;
  }
};
