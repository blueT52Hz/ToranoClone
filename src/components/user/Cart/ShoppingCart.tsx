import { useCart } from "@/context/UserContext";
import { Badge, Divider, Drawer, Flex, Modal } from "antd";
import { ShoppingCart as CartIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartItemComponent from "@/components/user/Cart/CartItemCard";
import "@components/user/Cart/style.css";

const ShoppingCart = () => {
  const { cart } = useCart();
  console.log(cart);

  const [openCart, setOpenCart] = useState(false);
  const [openSaleModal, setOpenSaleModal] = useState(false);
  const cart_total_price = useMemo(() => {
    if (!cart || cart.cartItems.length === 0) return 0; // Nếu giỏ hàng rỗng, trả về 0
    return cart.cartItems.reduce(
      (total, item) =>
        total +
        (item.variant.product.sale_price || item.variant.product.base_price) *
          item.quantity,
      0
    );
  }, [cart]); // Chỉ tính lại khi `cart` thay đổi

  return (
    <>
      <Badge
        showZero
        count={cart.cartItems.reduce((acc, item) => acc + item.quantity, 0)}
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
              className="text-slate-500 cursor-pointer"
              onClick={() => setOpenCart(false)}
            />
          </Flex>
        }
        footer={
          <div className="flex flex-col">
            {cart.cartItems.length > 0 && (
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
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
                  className="text-white bg-[#ff0000] rounded-md py-2 text-center my-4"
                >
                  THANH TOÁN
                </Link>
              </div>
            )}
            <Flex
              justify={window.innerWidth > 850 ? "space-between" : "center"}
              align="center"
              className="mb-4 text-base w-full"
              vertical={window.innerWidth < 850}
            >
              <Link
                to={cart.cartItems.length === 0 ? "/collections/all" : "/cart"}
                className="text-sm min850:text-base"
              >
                {cart.cartItems.length === 0
                  ? "Trở về trang sản phẩm"
                  : "Xem giỏ hàng"}
              </Link>
              <div
                onClick={() => setOpenSaleModal(true)}
                className="text-sm min850:text-base cursor-pointer mt-4 min850:mt-0"
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
        <div className="flex flex-col justify-center items-center overflow-y-auto height-full">
          {cart.cartItems.length === 0 ? (
            <>
              <div className="px-4">
                <img
                  src="https://theme.hstatic.net/200000690725/1001078549/14/cart_banner_image.jpg?v=647"
                  alt="Đơn hàng trống"
                  className="w-auto h-auto max-h-[370px]"
                />
              </div>
              <div className="text-sm min850:text-lg text-[#9e9e9e]">
                Chưa có sản phẩm trong giỏ hàng...
              </div>
            </>
          ) : (
            cart.cartItems.map((item) => (
              <CartItemComponent item={item} key={item.cart_item_id} />
            ))
          )}
        </div>
      </Drawer>
    </>
  );
};

export default ShoppingCart;
