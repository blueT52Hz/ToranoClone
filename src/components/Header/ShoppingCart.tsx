import { Badge, Divider, Drawer, Empty, Flex, Modal } from "antd";
import { ShoppingCart as CartIcon, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openSaleModal, setOpenSaleModal] = useState(false);
  return (
    <>
      <Badge
        showZero
        count={0}
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
      >
        <Flex vertical justify="center" align="center">
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

          <Flex
            justify={window.innerWidth > 850 ? "space-between" : "center"}
            align="center"
            className="mt-10 text-base w-full"
            vertical={window.innerWidth < 850}
          >
            <Link to={"/collections/all"} className="text-sm min850:text-base">
              Trở về trang sản phẩm
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
        </Flex>
      </Drawer>
    </>
  );
};

export default ShoppingCart;
