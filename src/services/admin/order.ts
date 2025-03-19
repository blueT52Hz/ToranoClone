import { CartItem, Order } from "@/types/cart";
import { supabase } from "../supabaseClient";

export async function getAllOrders(): Promise<Order[]> {
  // Fetch orders
  const { data: orders, error: ordersError } = await supabase
    .from("order")
    .select("*");

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const formattedOrders: Order[] = await Promise.all(
    orders.map(async (order) => {
      // Fetch shipping address
      const { data: shippingAddress, error: shippingAddressError } =
        await supabase
          .from("shipping_address")
          .select("*")
          .eq("address_id", order.address_id)
          .single();

      if (shippingAddressError) {
        throw new Error(shippingAddressError.message);
      }

      // Fetch cart
      const { data: cart, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("cart_id", order.cart_id)
        .single();

      if (cartError) {
        throw new Error(cartError.message);
      }

      // Fetch cart items
      const { data: cartItems, error: cartItemsError } = await supabase
        .from("cart_item")
        .select("*")
        .eq("cart_id", cart.cart_id);

      if (cartItemsError) {
        throw new Error(cartItemsError.message);
      }

      // Fetch product variants and products for each cart item
      const formattedCartItems: CartItem[] = await Promise.all(
        cartItems.map(async (cartItem) => {
          const { data: variant, error: variantError } = await supabase
            .from("product_variant")
            .select("*")
            .eq("variant_id", cartItem.variant_id)
            .single();

          if (variantError) {
            throw new Error(variantError.message);
          }

          const { data: product, error: productError } = await supabase
            .from("product")
            .select("*")
            .eq("product_id", variant.product_id)
            .single();

          if (productError) {
            throw new Error(productError.message);
          }

          const formattedCartItem: CartItem = {
            cart_item_id: cartItem.cart_item_id,
            created_at: new Date(cartItem.created_at),
            variant: {
              variant_id: variant.variant_id,
              variant_code: variant.variant_code,
              product: {
                product_id: product.product_id,
                name: product.name,
                base_price: product.base_price,
                sale_price: product.sale_price,
              },
              image: {
                image_id: variant.image_id,
                image_url: "", // Fetch image URL from product_image table if needed
                image_name: "", // Fetch image name from product_image table if needed
                created_at: new Date(), // Fetch created_at from product_image table if needed
                published_at: null, // Fetch published_at from product_image table if needed
                updated_at: new Date(), // Fetch updated_at from product_image table if needed
              },
              created_at: new Date(variant.created_at),
              published_at: variant.published_at
                ? new Date(variant.published_at)
                : null,
              updated_at: new Date(variant.updated_at),
              quantity: variant.quantity,
              color: {
                color_id: variant.color_id,
                color_name: "", // Fetch color name from color table if needed
                color_code: "", // Fetch color code from color table if needed
              },
              size: {
                size_id: variant.size_id,
                size_code: "", // Fetch size code from size table if needed
              },
            },
            quantity: cartItem.quantity,
          };

          return formattedCartItem;
        })
      );

      const formattedOrder: Order = {
        order_id: order.order_id,
        created_at: new Date(order.created_at),
        shippingAddress: {
          address_id: shippingAddress.address_id,
          user_id: shippingAddress.user_id,
          full_name: shippingAddress.full_name,
          phone_number: shippingAddress.phone_number,
          address_detail: shippingAddress.address_detail,
          city: shippingAddress.city,
          district: shippingAddress.district,
          ward: shippingAddress.ward,
          is_default: shippingAddress.is_default,
          created_at: new Date(shippingAddress.created_at),
          updated_at: new Date(shippingAddress.updated_at),
        },
        cart: {
          cart_id: cart.cart_id,
          cartItems: formattedCartItems,
        },
        note: order.note,
        payment_method: order.payment_method,
        status: order.status,
        discount: order.discount,
        shipping_fee: order.shipping_fee,
        final_price: order.final_price,
      };

      return formattedOrder;
    })
  );

  return formattedOrders;
}

export async function getOrderById(orderId: string): Promise<Order> {
  // Fetch the order by order_id
  const { data: order, error: orderError } = await supabase
    .from("order")
    .select("*")
    .eq("order_id", orderId)
    .single();

  console.log(orderId);

  if (orderError) {
    console.error("Error fetching order:", orderError.message);
    throw orderError;
  }

  if (!order) {
    console.error("Order not found");
    throw new Error("Order not found"); // Tạo một lỗi mới nếu đơn hàng không tồn tại
  }

  // Fetch shipping address
  const { data: shippingAddress, error: shippingAddressError } = await supabase
    .from("shipping_address")
    .select("*")
    .eq("address_id", order.address_id)
    .single();

  if (shippingAddressError) {
    throw new Error(shippingAddressError.message);
  }

  // Fetch cart
  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("*")
    .eq("cart_id", order.cart_id)
    .single();

  if (cartError) {
    throw new Error(cartError.message);
  }

  // Fetch cart items
  const { data: cartItems, error: cartItemsError } = await supabase
    .from("cart_item")
    .select("*")
    .eq("cart_id", cart.cart_id);

  if (cartItemsError) {
    throw new Error(cartItemsError.message);
  }

  // Fetch product variants and products for each cart item
  const formattedCartItems: CartItem[] = await Promise.all(
    cartItems.map(async (cartItem) => {
      const { data: variant, error: variantError } = await supabase
        .from("product_variant")
        .select("*")
        .eq("variant_id", cartItem.variant_id)
        .single();

      if (variantError) {
        throw new Error(variantError.message);
      }

      const { data: product, error: productError } = await supabase
        .from("product")
        .select("*")
        .eq("product_id", variant.product_id)
        .single();

      if (productError) {
        throw new Error(productError.message);
      }

      // Fetch color and size details
      const { data: color, error: colorError } = await supabase
        .from("color")
        .select("*")
        .eq("color_id", variant.color_id)
        .single();

      if (colorError) {
        throw new Error(colorError.message);
      }

      const { data: size, error: sizeError } = await supabase
        .from("size")
        .select("*")
        .eq("size_id", variant.size_id)
        .single();

      if (sizeError) {
        throw new Error(sizeError.message);
      }

      // Fetch image details
      const { data: image, error: imageError } = await supabase
        .from("product_image")
        .select("*")
        .eq("image_id", variant.image_id)
        .single();

      if (imageError) {
        throw new Error(imageError.message);
      }

      const formattedCartItem: CartItem = {
        cart_item_id: cartItem.cart_item_id,
        created_at: new Date(cartItem.created_at),
        variant: {
          variant_id: variant.variant_id,
          variant_code: variant.variant_code,
          product: {
            product_id: product.product_id,
            name: product.name,
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
        },
        quantity: cartItem.quantity,
      };

      return formattedCartItem;
    })
  );

  // Format the order
  const formattedOrder: Order = {
    order_id: order.order_id,
    created_at: new Date(order.created_at),
    shippingAddress: {
      address_id: shippingAddress.address_id,
      user_id: shippingAddress.user_id,
      full_name: shippingAddress.full_name,
      phone_number: shippingAddress.phone_number,
      address_detail: shippingAddress.address,
      city: shippingAddress.city,
      district: shippingAddress.district,
      ward: shippingAddress.ward,
      is_default: shippingAddress.is_default,
      created_at: new Date(shippingAddress.created_at),
      updated_at: new Date(shippingAddress.updated_at),
    },
    cart: {
      cart_id: cart.cart_id,
      cartItems: formattedCartItems,
    },
    note: order.note,
    payment_method: order.payment_method,
    status: order.status,
    discount: order.discount,
    shipping_fee: order.shipping_fee,
    final_price: order.final_price,
  };

  return formattedOrder;
}
