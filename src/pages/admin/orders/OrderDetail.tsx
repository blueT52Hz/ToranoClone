import { getOrderById } from "@/services/admin/order";
import { supabase } from "@/services/supabaseClient";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Interfaces
interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

interface Color {
  color_id: string;
  name: string;
  hex_code: string;
}

interface Size {
  size_id: string;
  name: string;
}

interface ProductImage {
  image_id: string;
  url: string;
  alt: string;
}

interface Collection {
  collection_id: string;
  name: string;
}

interface Outfit {
  outfit_id: string;
  name: string;
}

interface Product {
  product_id: string;
  product_code: string;
  brand_name: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  sale_price: number | null;
  discount: number;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  collections: Collection[];
  outfit: Outfit[];
  variants: ProductVariant[];
  variant_images: ProductImage[];
}

interface ProductVariant {
  variant_id: string;
  variant_code: string;
  product_id: string;
  image: ProductImage;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
  quantity: number;
  color: Color;
  size: Size;
}

interface CartItem {
  product: Product;
  created_at: Date;
  cartItem_id: string;
  variant: ProductVariant;
  quantity: number;
}

interface Cart {
  cart_id: string;
  cartItems: CartItem[];
  cart_total_price: number;
}

interface Order {
  order_id: string;
  created_at: Date;
  shippingAddress: ShippingAddress;
  cart: Cart;
  note: string | null;
  payment_method: "cod" | "online_payment" | "bank_transfer";
  status: "pending_approval" | "shipping" | "completed" | "canceled";
  discount: number | null;
  shipping_fee: number | 30000;
  final_price: number;
}

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
    null
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
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <p className="text-gray-600 mt-1">
              Mã đơn hàng: <span className="font-medium">{order.order_id}</span>
            </p>
            <p className="text-gray-600">
              Ngày đặt: {formatDate(order.created_at)}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {!isEditingStatus ? (
              <>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
                <button
                  onClick={() => setIsEditingStatus(true)}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setIsEditingStatus(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer and Shipping Info */}
      <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Thông tin giao hàng
          </h2>
          <div className="text-gray-700">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p>Số điện thoại: {order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.province},{" "}
              {order.shippingAddress.postal_code}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Phương thức thanh toán
          </h2>
          <p className="text-gray-700">
            {getPaymentMethodText(order.payment_method)}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.cart.cartItems.map((item) => {
                const price =
                  item.product.sale_price || item.product.base_price;
                const totalPrice = price * item.quantity;

                return (
                  <tr key={item.cartItem_id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.variant.image.url || "/placeholder.svg"}
                            alt={item.variant.image.alt}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-1"
                              style={{
                                backgroundColor: item.variant.color.hex_code,
                              }}
                            ></span>
                            {item.variant.color.name}, {item.variant.size.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Mã: {item.variant.variant_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {formatCurrency(price)}
                      {item.product.sale_price && (
                        <span className="line-through text-gray-400 ml-2">
                          {formatCurrency(item.product.base_price)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 text-right font-medium">
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
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="text-gray-900 font-medium">
              {formatCurrency(order.cart.cart_total_price)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="text-gray-900 font-medium">
              {formatCurrency(order.shipping_fee)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá:</span>
            <span className="text-green-600 font-medium">
              -{formatCurrency(order.discount || 0)}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3 mt-3">
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
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Ghi chú</h2>
        <p className="text-gray-700">{order.note || "Không có ghi chú"}</p>
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            In đơn hàng
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
