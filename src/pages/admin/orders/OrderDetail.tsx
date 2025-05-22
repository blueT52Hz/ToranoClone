import Loading from "@/components/common/Loading";
import { getOrderById } from "@/services/admin/order";
import { supabase } from "@/services/supabaseClient";
import { Order } from "@/types/cart.type";
import { notification } from "antd";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusColor = (status: Order["status"]): string => {
  switch (status) {
    case "pending_approval":
      return "bg-yellow-100 text-yellow-800";
    case "shipping":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: Order["status"]): string => {
  switch (status) {
    case "pending_approval":
      return "Chờ xác nhận";
    case "shipping":
      return "Đang giao hàng";
    case "completed":
      return "Hoàn thành";
    case "canceled":
      return "Đã hủy";
    default:
      return status;
  }
};

const getPaymentMethodText = (method: Order["payment_method"]): string => {
  switch (method) {
    case "cod":
      return "Thanh toán khi nhận hàng (COD)";
    case "online_payment":
      return "Thanh toán trực tuyến";
    case "bank_transfer":
      return "Chuyển khoản ngân hàng";
    default:
      return method;
  }
};

// Component
export const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editedStatus, setEditedStatus] = useState<Order["status"] | null>(
    null,
  );

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      const result = await getOrderById(orderId);

      setOrder(result);
      setEditedStatus(result.status);
      setLoading(false);
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleSaveStatus = async () => {
    if (!order || !editedStatus) return;

    try {
      const { data, error } = await supabase
        .from("order")
        .update({ status: editedStatus })
        .eq("order_id", order.order_id);

      if (error) {
        throw new Error(`Lỗi khi cập nhật trạng thái: ${error.message}`);
      }

      setOrder({ ...order, status: editedStatus });
      setIsEditingStatus(false);
      notification.success({
        message: "Cập nhật trạng thái thành công!",
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      notification.error({
        message: "Có lỗi xảy ra khi cập nhật trạng thái.",
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-md">
      {/* Order Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <p className="mt-1 text-gray-600">
              Mã đơn hàng: <span className="font-medium">{order.order_id}</span>
            </p>
            <p className="text-gray-600">
              Ngày đặt: {formatDate(order.created_at)}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 md:mt-0">
            {!isEditingStatus ? (
              <>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
                <button
                  onClick={() => setIsEditingStatus(true)}
                  className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Chỉnh sửa trạng thái
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={editedStatus}
                  onChange={(e) =>
                    setEditedStatus(e.target.value as Order["status"])
                  }
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="pending_approval">Chờ xác nhận</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="canceled">Đã hủy</option>
                </select>
                <button
                  onClick={handleSaveStatus}
                  className="rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setIsEditingStatus(false)}
                  className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer and Shipping Info */}
      <div className="grid grid-cols-1 gap-6 border-b border-gray-200 p-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Thông tin giao hàng
          </h2>
          <div className="text-gray-700">
            <p className="font-medium">{order.shippingAddress.full_name}</p>
            <p>Số điện thoại: {order.shippingAddress.phone_number}</p>
            <p>{order.shippingAddress.address_detail}</p>
            <p>
              {order.shippingAddress.ward}, {order.shippingAddress.district},{" "}
              {order.shippingAddress.city}
            </p>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Phương thức thanh toán
          </h2>
          <p className="text-gray-700">
            {getPaymentMethodText(order.payment_method)}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Đơn giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Số lượng
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.cart.cartItems.map((item) => {
                const price =
                  item.variant.product.sale_price ||
                  item.variant.product.base_price;
                const totalPrice = price * item.quantity;

                return (
                  <tr key={item.cart_item_id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={
                              item.variant.image.image_url || "/placeholder.svg"
                            }
                            alt={item.variant.image.image_name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.variant.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span
                              className="mr-1 inline-block h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: item.variant.color.color_code,
                              }}
                            ></span>
                            {item.variant.color.color_name},{" "}
                            {item.variant.size.size_code}
                          </div>
                          <div className="text-xs text-gray-500">
                            Mã: {item.variant.variant_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatCurrency(price)}
                      {item.variant.product.sale_price && (
                        <span className="ml-2 text-gray-400 line-through">
                          {formatCurrency(item.variant.product.base_price)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(totalPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(
                order.cart.cartItems.reduce(
                  (total, cartItem) =>
                    total +
                    cartItem.quantity *
                      (cartItem.variant.product.sale_price ||
                        cartItem.variant.product.base_price),
                  0,
                ),
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(order.shipping_fee)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá:</span>
            <span className="font-medium text-green-600">
              -{formatCurrency(order.discount || 0)}
            </span>
          </div>
          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Tổng cộng:
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(order.final_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Ghi chú</h2>
        <p className="text-gray-700">{order.note || "Không có ghi chú"}</p>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            In đơn hàng
          </button>
          <button className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
