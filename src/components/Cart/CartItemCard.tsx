import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CartItem } from "@/types/cart";
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
    <div className="flex items-center py-3 w-full overflow-y-auto">
      <div className="mr-4">
        <Image
          src={item.variant.image.image_url}
          className="object-cover rounded-md"
          width={"4.5rem"}
          height={"4.5rem"}
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <h3 className="font-semibold text-sm flex-1">{item.product.name}</h3>
          <button className=" text-gray-500 hover:text-black">
            <X
              size={20}
              onClick={() => removeItemFromCart(item.variant.variant_id)}
            />
          </button>
        </div>
        <div>
          <p className="text-xs text-gray-500 mt-1">
            {item.variant.color.color_name}/{item.variant.size.size_code}
          </p>

          <div className="flex justify-between">
            <div className="flex items-center mt-1">
              <button
                onClick={() => {
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="h-6 w-6 bg-slate-100 rounded"
              >
                −
              </button>
              <input
                type="number"
                className="w-10 text-center mx-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none"
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
                className="h-6 w-6 bg-slate-100 rounded"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="font-semibold text-black">
                {(item.product.sale_price
                  ? item.product.sale_price * quantity
                  : item.product.base_price * quantity
                ).toLocaleString()}
                ₫
              </p>
              {item.product.sale_price && (
                <p className="text-gray-400 text-sm line-through">
                  {(quantity * item.product.base_price).toLocaleString()}₫
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
