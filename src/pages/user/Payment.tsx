import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { notification, Progress, QRCode } from "antd";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { finalizePayment } = useUser();

  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(20); // 60 giây
  const [progress, setProgress] = useState(100); // Thanh progress 100%

  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate("/checkout");
      return;
    }

    let successTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    // Mô phỏng thanh toán thành công sau 5 giây
    // successTimer = setTimeout(() => {
    //   setPaymentStatus("success");

    //   notification.success({
    //     message: "Thanh toán thành công",
    //     description:
    //       "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn sẽ được xử lý ngay.",
    //     placement: "topRight",
    //   });

    //   finalizePayment();

    //   setTimeout(() => {
    //     navigate("/");
    //   }, 2000);
    // }, 5000);

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
  }, [orderData, navigate, finalizePayment]);

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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 my-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Thanh toán trực tuyến</h2>
        <p className="text-gray-600 mb-4">
          Quét mã QR bên dưới để thanh toán số tiền{" "}
          <span className="font-semibold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(orderData.final_price)}
          </span>
        </p>

        {paymentStatus === "pending" && (
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              Thời gian còn lại: {timeLeft} giây
            </p>
            <Progress percent={progress} showInfo={false} />
          </div>
        )}
      </div>

      {/* Mã QR */}
      <div className="flex justify-center mb-6">
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <div className="w-48 h-48 bg-white p-2">
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
