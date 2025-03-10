import AppBreadcrumb from "@/components/Breadcrumb/AppBreadcrumb";
import { useCart } from "@/context/UserContext";
import React from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart } = useCart();
  return (
    <>
      <AppBreadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: (
              <span className="cursor-pointer">
                Giỏ hàng ({cart.cartItems.length})
              </span>
            ),
          },
        ]}
      ></AppBreadcrumb>
    </>
  );
};

export default Cart;
