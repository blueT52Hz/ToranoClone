import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CartItem } from "@/types/cart.type";
import { useCart } from "@/context/UserContext";
import { Image } from "antd";

interface CartItemProps {
  item: CartItem;
}

const CartItemComponent = ({ item }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const { removeItemFromCart, updateItemQuantity } = useCart();
  useEffect(() => {
    updateItemQuantity(item.variant.variant_id, quantity);
  }, [quantity]);
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item]);

  return (
    <div className="flex w-full items-center overflow-y-auto py-3">
      <div className="mr-4">
        <Image
          src={item.variant.image.image_url}
          className="rounded-md object-cover"
          width={"4.5rem"}
          height={"4.5rem"}
        />
      </div>
      <div className="flex w-full flex-col">
        <div className="flex justify-between">
          <h3 className="flex-1 text-sm font-semibold">
            {item.variant.product.name}
          </h3>
          <button className="text-gray-500 hover:text-black">
            <X
              size={20}
              onClick={() => removeItemFromCart(item.variant.variant_id)}
            />
          </button>
        </div>
        <div>
          <p className="mt-1 text-xs text-gray-500">
            {item.variant.color.color_name}/{item.variant.size.size_code}
          </p>

          <div className="flex justify-between">
            <div className="mt-1 flex items-center">
              <button
                onClick={() => {
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="h-6 w-6 rounded bg-slate-100"
              >
                −
              </button>
              <input
                type="number"
                className="mx-2 w-10 text-center focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuantity(value === "" ? 1 : Math.max(1, Number(value)));
                }}
              />
              <button
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
                className="h-6 w-6 rounded bg-slate-100"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="font-semibold text-black">
                {(item.variant.product.sale_price
                  ? item.variant.product.sale_price * quantity
                  : item.variant.product.base_price * quantity
                ).toLocaleString()}
                ₫
              </p>
              {item.variant.product.sale_price && (
                <p className="text-sm text-gray-400 line-through">
                  {(
                    quantity * item.variant.product.base_price
                  ).toLocaleString()}
                  ₫
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;
