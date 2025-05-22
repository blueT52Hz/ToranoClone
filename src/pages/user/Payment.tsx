import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart, useUser } from "@/context/UserContext";
import { notification, Progress, QRCode } from "antd";
import { Order } from "@/types/cart.type";
import { v4 } from "uuid";
import {
  createOrderByUserId,
  createOrderWithoutUserId,
} from "@/services/client/user/user";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user } = useUser();

  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(20); // 60 giây
  const [progress, setProgress] = useState(100); // Thanh progress 100%

  const orderData = location.state?.orderData;
  const guestAddress = location.state?.guestAddress;
  console.log(guestAddress);

  const cartTotal = cart.cartItems.reduce((total, item) => {
    const price =
      item.variant.product.sale_price ?? item.variant.product.base_price;
    return total + price * item.quantity;
  }, 0);

  const createOrder = async (orderData: Partial<Order>) => {
    const cartTotal = cart.cartItems.reduce((total, item) => {
      const price =
        item.variant.product.sale_price ?? item.variant.product.base_price;
      return total + price * item.quantity;
    }, 0);

    const shippingFee = orderData.shipping_fee ?? 30000;
    const discount = orderData.discount ?? 0;
    const finalPrice = cartTotal + shippingFee - discount;

    const newOrder: Order = {
      order_id: v4(),
      created_at: new Date(),
      shippingAddress: orderData.shippingAddress!,
      cart: cart,
      note: orderData.note ?? null,
      payment_method: orderData.payment_method ?? "cod",
      status: "pending_approval",
      discount: discount,
      shipping_fee: shippingFee,
      final_price: finalPrice,
    };
    if (user) {
      const resultOrder = await createOrderByUserId({
        order_id: newOrder.order_id,
        user_id: user.user_id,
        cart_id: cart.cart_id,
        address_id: newOrder.shippingAddress.address_id,
        status: newOrder.status,
        payment_method: newOrder.payment_method,
        note: newOrder.note,
        discount: newOrder.discount,
        shipping_fee: newOrder.shipping_fee,
        final_price: newOrder.final_price,
      });
      if (resultOrder) clearCart();
    } else if (guestAddress) {
      console.log(guestAddress);

      const resultOrder = await createOrderWithoutUserId(
        cart,
        {
          status: newOrder.status,
          payment_method: newOrder.payment_method,
          note: newOrder.note,
          discount: newOrder.discount,
          shipping_fee: newOrder.shipping_fee,
          final_price: newOrder.final_price,
        },
        guestAddress,
      );
      if (resultOrder) clearCart();
    }

    return newOrder;
  };

  useEffect(() => {
    if (!orderData) {
      navigate("/checkout");
      return;
    }

    let successTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    successTimer = setTimeout(async () => {
      setPaymentStatus("success");

      notification.success({
        message: "Thanh toán thành công",
        description:
          "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn sẽ được xử lý ngay.",
        placement: "topRight",
      });

      const newOrder = await createOrder(orderData);
      console.log(newOrder);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 5000);

    countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          clearInterval(progressInterval);

          if (paymentStatus === "pending") {
            setPaymentStatus("failed");

            notification.error({
              message: "Thanh toán thất bại",
              description: "Thời gian thanh toán đã hết. Vui lòng thử lại sau.",
              placement: "topRight",
            });
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    progressInterval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 100 / timeLeft, 0));
    }, 1000);

    return () => {
      // clearTimeout(successTimer);
      clearInterval(countdownInterval);
      clearInterval(progressInterval);
    };
  }, [orderData, navigate]);

  const handleCancel = () => {
    navigate("/checkout");
  };

  if (!orderData) {
    return (
      <div className="p-6 text-center">
        <p>
          Không tìm thấy thông tin đơn hàng. Vui lòng quay lại trang thanh toán.
        </p>
        <button onClick={() => navigate("/checkout")} className="mt-4">
          Quay lại thanh toán
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 max-w-md rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-xl font-semibold">Thanh toán trực tuyến</h2>
        <p className="mb-4 text-gray-600">
          Quét mã QR bên dưới để thanh toán số tiền{" "}
          <span className="font-semibold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(cartTotal)}
          </span>
        </p>

        {paymentStatus === "pending" && (
          <div className="mb-4">
            <p className="mb-2 text-gray-600">
              Thời gian còn lại: {timeLeft} giây
            </p>
            <Progress percent={progress} showInfo={false} />
          </div>
        )}
      </div>

      {/* Mã QR */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
          <div className="h-48 w-48 bg-white p-2">
            <QRCode value={"https://www.momo.vn/"} />
          </div>
        </div>
      </div>

      {/* Nút hủy hoặc quay lại */}
      <div className="flex justify-between">
        {paymentStatus === "pending" && (
          <button onClick={handleCancel} className="w-full">
            Hủy thanh toán
          </button>
        )}

        {paymentStatus === "failed" && (
          <button onClick={() => navigate("/checkout")} className="w-full">
            Quay lại thanh toán
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;
