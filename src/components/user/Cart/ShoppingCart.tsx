import { Badge, Divider, Drawer, Flex, Modal } from "antd";
import { ShoppingCart as CartIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartItemComponent from "@/components/user/Cart/CartItemCard";
import "@components/user/Cart/style.css";
import { useCartStore } from "@/store/user/cartStore";
const ShoppingCart = () => {
  const { cart } = useCartStore();
  console.log(cart);

  const [openCart, setOpenCart] = useState(false);
  const [openSaleModal, setOpenSaleModal] = useState(false);
  const cart_total_price = useMemo(() => {
    if (!cart || cart.cart_items.length === 0) return 0;
    return cart.cart_items.reduce(
      (total, item) =>
        total +
        (item.product.sale_price || item.product.base_price) * item.quantity,
      0,
    );
  }, [cart]);

  return (
    <>
      <Badge
        showZero
        count={cart.cart_items.reduce((acc, item) => acc + item.quantity, 0)}
        size="default"
        onClick={() => setOpenCart(true)}
        className="cursor-pointer"
      >
        <CartIcon size={"1.5rem"}></CartIcon>
      </Badge>
      <Drawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        closeIcon={null}
        placement="right"
        width={window.innerWidth > 850 ? "30rem" : "20rem"}
        title={
          <Flex
            className="relative w-full"
            justify="space-between"
            align="center"
          >
            <h1 className="text-[1.375rem]">Giỏ hàng</h1>
            <X
              className="cursor-pointer text-slate-500"
              onClick={() => setOpenCart(false)}
            />
          </Flex>
        }
        footer={
          <div className="flex flex-col">
            {cart.cart_items.length > 0 && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="text-base uppercase">Tổng cộng:</div>
                  <div className="text-lg font-semibold">
                    {cart_total_price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="my-4 rounded-md bg-[#ff0000] py-2 text-center text-white"
                  onClick={() => setOpenCart(false)}
                >
                  THANH TOÁN
                </Link>
              </div>
            )}
            <Flex
              justify={window.innerWidth > 850 ? "space-between" : "center"}
              align="center"
              className="mb-4 w-full text-base"
              vertical={window.innerWidth < 850}
            >
              <Link
                to={cart.cart_items.length === 0 ? "/collections/all" : "/cart"}
                className="text-sm min850:text-base"
              >
                {cart.cart_items.length === 0
                  ? "Trở về trang sản phẩm"
                  : "Xem giỏ hàng"}
              </Link>
              <div
                onClick={() => setOpenSaleModal(true)}
                className="mt-4 cursor-pointer text-sm min850:mt-0 min850:text-base"
              >
                Khuyến mãi dành cho bạn
              </div>
              <Modal
                centered
                open={openSaleModal}
                onCancel={() => setOpenSaleModal(false)}
                onClose={() => setOpenSaleModal(false)}
                title={
                  <div>
                    <div className="text-lg">Khuyến mãi dành cho bạn</div>{" "}
                    <Divider className="text-black"></Divider>
                  </div>
                }
                footer={null}
                width={"23rem"}
              >
                <div className="min-h-20"></div>
              </Modal>
            </Flex>
          </div>
        }
      >
        <div className="height-full flex flex-col items-center justify-center overflow-y-auto">
          {cart.cart_items.length === 0 ? (
            <>
              <div className="px-4">
                <img
                  src="https://theme.hstatic.net/200000690725/1001078549/14/cart_banner_image.jpg?v=647"
                  alt="Đơn hàng trống"
                  className="h-auto max-h-[370px] w-auto"
                />
              </div>
              <div className="text-sm text-[#9e9e9e] min850:text-lg">
                Chưa có sản phẩm trong giỏ hàng...
              </div>
            </>
          ) : (
            cart.cart_items.map((item, index) => (
              <CartItemComponent item={item} key={index} />
            ))
          )}
        </div>
      </Drawer>
    </>
  );
};

export default ShoppingCart;
