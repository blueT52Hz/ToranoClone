import { Cart, CartItem } from "@/types/cart.type";
import { supabase } from "../../supabaseClient";

export const createCart = async (userId: string) => {
  const { error } = await supabase.from("cart").insert([
    {
      user_id: userId,
    },
  ]);

  if (error) {
    throw `Lỗi khi tạo giỏ hàng: ${error.message}`;
  }
};

export const getCartByUserId = async (userId: string): Promise<Cart> => {
  // Lấy thông tin giỏ hàng mới nhất của người dùng
  const { data: cartData, error: cartError } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (cartError || !cartData) throw cartError;

  // Lấy các cartItem liên quan đến giỏ hàng
  const { data: cartItemsData, error: cartItemsError } = await supabase
    .from("cart_item")
    .select("*")
    .eq("cart_id", cartData.cart_id);

  if (cartItemsError) throw cartItemsError;

  // Lấy thông tin chi tiết của từng cartItem (variant và image)
  const cartItems: CartItem[] = await Promise.all(
    cartItemsData.map(async (item) => {
      // Lấy thông tin variant
      const { data: variantData, error: variantError } = await supabase
        .from("product_variant")
        .select("*")
        .eq("variant_id", item.variant_id)
        .single();

      if (variantError) throw variantError;

      // Lấy thông tin image của variant
      const { data: imageData, error: imageError } = await supabase
        .from("product_image")
        .select("*")
        .eq("image_id", variantData.image_id)
        .single();

      if (imageError) throw imageError;

      // Lấy thông tin product của variant
      const { data: productData, error: productError } = await supabase
        .from("product")
        .select("*")
        .eq("product_id", variantData.product_id)
        .single();

      if (productError) throw productError;

      // Lấy thông tin color của variant
      const { data: colorData, error: colorError } = await supabase
        .from("color")
        .select("*")
        .eq("color_id", variantData.color_id)
        .single();

      if (colorError) throw colorError;

      // Lấy thông tin size của variant
      const { data: sizeData, error: sizeError } = await supabase
        .from("size")
        .select("*")
        .eq("size_id", variantData.size_id)
        .single();

      if (sizeError) throw sizeError;

      // Tạo đối tượng CartItem
      const cartItem: CartItem = {
        cart_item_id: item.cartItem_id,
        created_at: new Date(item.created_at),
        variant: {
          variant_id: variantData.variant_id,
          variant_code: variantData.variant_code,
          product: {
            product_id: productData.product_id,
            name: productData.name,
            base_price: productData.base_price,
            sale_price: productData.sale_price,
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
          created_at: new Date(variantData.created_at),
          published_at: variantData.published_at
            ? new Date(variantData.published_at)
            : null,
          updated_at: new Date(variantData.updated_at),
          quantity: variantData.quantity,
          color: {
            color_id: colorData.color_id,
            color_name: colorData.color_name,
            color_code: colorData.color_code,
          },
          size: {
            size_id: sizeData.size_id,
            size_code: sizeData.size_code,
          },
        },
        quantity: item.quantity,
      };

      return cartItem;
    }),
  );

  // Tạo đối tượng Cart hoàn chỉnh
  const cart: Cart = {
    cart_id: cartData.cart_id,
    cartItems: cartItems,
  };

  return cart;
};
