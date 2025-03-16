import type React from "react";
import { useState } from "react";

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
const EditableOrderDetails: React.FC<{
  order: Order;
  onSave: (updatedOrder: Order) => void;
}> = ({ order: initialOrder, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [order, setOrder] = useState<Order>(initialOrder);
  const [editedShippingAddress, setEditedShippingAddress] =
    useState<ShippingAddress>(initialOrder.shippingAddress);
  const [editedPaymentMethod, setEditedPaymentMethod] = useState<
    Order["payment_method"]
  >(initialOrder.payment_method);
  const [editedNote, setEditedNote] = useState<string | null>(
    initialOrder.note
  );
  const [editedStatus, setEditedStatus] = useState<Order["status"]>(
    initialOrder.status
  );
  const [editedShippingFee, setEditedShippingFee] = useState<number>(
    initialOrder.shipping_fee
  );
  const [editedDiscount, setEditedDiscount] = useState<number | null>(
    initialOrder.discount
  );

  const handleSave = () => {
    const updatedOrder: Order = {
      ...order,
      shippingAddress: editedShippingAddress,
      payment_method: editedPaymentMethod,
      note: editedNote,
      status: editedStatus,
      shipping_fee: editedShippingFee,
      discount: editedDiscount,
      final_price: calculateFinalPrice(),
    };

    setOrder(updatedOrder);
    onSave(updatedOrder);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedShippingAddress(order.shippingAddress);
    setEditedPaymentMethod(order.payment_method);
    setEditedNote(order.note);
    setEditedStatus(order.status);
    setEditedShippingFee(order.shipping_fee);
    setEditedDiscount(order.discount);
    setIsEditing(false);
  };

  const calculateFinalPrice = () => {
    const subtotal = order.cart.cart_total_price;
    const shippingFee = editedShippingFee;
    const discount = editedDiscount || 0;
    return subtotal + shippingFee - discount;
  };

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
            {!isEditing ? (
              <>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Chỉnh sửa
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
          {!isEditing ? (
            <div className="text-gray-700">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>Số điện thoại: {order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.province},{" "}
                {order.shippingAddress.postal_code}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  id="name"
                  value={editedShippingAddress.name}
                  onChange={(e) =>
                    setEditedShippingAddress({
                      ...editedShippingAddress,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  value={editedShippingAddress.phone}
                  onChange={(e) =>
                    setEditedShippingAddress({
                      ...editedShippingAddress,
                      phone: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  value={editedShippingAddress.address}
                  onChange={(e) =>
                    setEditedShippingAddress({
                      ...editedShippingAddress,
                      address: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={editedShippingAddress.city}
                    onChange={(e) =>
                      setEditedShippingAddress({
                        ...editedShippingAddress,
                        city: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    id="province"
                    value={editedShippingAddress.province}
                    onChange={(e) =>
                      setEditedShippingAddress({
                        ...editedShippingAddress,
                        province: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="postal_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã bưu điện
                </label>
                <input
                  type="text"
                  id="postal_code"
                  value={editedShippingAddress.postal_code}
                  onChange={(e) =>
                    setEditedShippingAddress({
                      ...editedShippingAddress,
                      postal_code: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Phương thức thanh toán
          </h2>
          {!isEditing ? (
            <p className="text-gray-700">
              {getPaymentMethodText(order.payment_method)}
            </p>
          ) : (
            <div>
              <select
                value={editedPaymentMethod}
                onChange={(e) =>
                  setEditedPaymentMethod(
                    e.target.value as Order["payment_method"]
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="online_payment">Thanh toán trực tuyến</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
              </select>
            </div>
          )}
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
            {!isEditing ? (
              <span className="text-gray-900 font-medium">
                {formatCurrency(order.shipping_fee)}
              </span>
            ) : (
              <div className="flex items-center">
                <input
                  type="number"
                  value={editedShippingFee}
                  onChange={(e) => setEditedShippingFee(Number(e.target.value))}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                />
                <span className="ml-2">VND</span>
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá:</span>
            {!isEditing ? (
              <span className="text-green-600 font-medium">
                -{formatCurrency(order.discount || 0)}
              </span>
            ) : (
              <div className="flex items-center">
                <input
                  type="number"
                  value={editedDiscount || 0}
                  onChange={(e) => setEditedDiscount(Number(e.target.value))}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                />
                <span className="ml-2">VND</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Tổng cộng:
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {isEditing
                  ? formatCurrency(calculateFinalPrice())
                  : formatCurrency(order.final_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Ghi chú</h2>
        {!isEditing ? (
          <p className="text-gray-700">{order.note || "Không có ghi chú"}</p>
        ) : (
          <textarea
            value={editedNote || ""}
            onChange={(e) => setEditedNote(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            placeholder="Nhập ghi chú đơn hàng"
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              {order.status === "pending_approval" && (
                <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Hủy đơn hàng
                </button>
              )}
              <button className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                In đơn hàng
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Liên hệ hỗ trợ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Example usage with mock data
const ExampleEditableOrderDetails: React.FC = () => {
  // Mock data for demonstration
  const mockOrder: Order = {
    order_id: "ORD-12345",
    created_at: new Date("2023-03-15T10:30:00"),
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0987654321",
      address: "123 Đường Lê Lợi, Phường Bến Nghé",
      city: "Quận 1",
      province: "TP. Hồ Chí Minh",
      postal_code: "700000",
    },
    cart: {
      cart_id: "CART-789",
      cartItems: [
        {
          cartItem_id: "CI-001",
          created_at: new Date("2023-03-15T10:25:00"),
          quantity: 2,
          product: {
            product_id: "P-001",
            product_code: "TS-001",
            brand_name: "ACME",
            name: "Áo thun nam cổ tròn",
            slug: "ao-thun-nam-co-tron",
            description: "Áo thun nam cổ tròn chất liệu cotton cao cấp",
            base_price: 350000,
            sale_price: 299000,
            discount: 15,
            created_at: new Date("2023-01-01"),
            published_at: new Date("2023-01-05"),
            updated_at: new Date("2023-01-05"),
            collections: [{ collection_id: "C-001", name: "Áo thun nam" }],
            outfit: [{ outfit_id: "O-001", name: "Casual" }],
            variants: [],
            variant_images: [],
          },
          variant: {
            variant_id: "V-001",
            variant_code: "TS-001-BL-L",
            product_id: "P-001",
            image: {
              image_id: "IMG-001",
              url: "https://via.placeholder.com/150",
              alt: "Áo thun nam màu xanh size L",
            },
            created_at: new Date("2023-01-01"),
            published_at: new Date("2023-01-05"),
            updated_at: new Date("2023-01-05"),
            quantity: 50,
            color: {
              color_id: "C-001",
              name: "Xanh dương",
              hex_code: "#1E90FF",
            },
            size: {
              size_id: "S-003",
              name: "L",
            },
          },
        },
        {
          cartItem_id: "CI-002",
          created_at: new Date("2023-03-15T10:27:00"),
          quantity: 1,
          product: {
            product_id: "P-002",
            product_code: "QJ-001",
            brand_name: "ACME",
            name: "Quần jean nam slim fit",
            slug: "quan-jean-nam-slim-fit",
            description: "Quần jean nam slim fit chất liệu denim cao cấp",
            base_price: 650000,
            sale_price: null,
            discount: 0,
            created_at: new Date("2023-01-10"),
            published_at: new Date("2023-01-15"),
            updated_at: new Date("2023-01-15"),
            collections: [{ collection_id: "C-002", name: "Quần jean nam" }],
            outfit: [{ outfit_id: "O-001", name: "Casual" }],
            variants: [],
            variant_images: [],
          },
          variant: {
            variant_id: "V-002",
            variant_code: "QJ-001-BK-32",
            product_id: "P-002",
            image: {
              image_id: "IMG-002",
              url: "https://via.placeholder.com/150",
              alt: "Quần jean nam màu đen size 32",
            },
            created_at: new Date("2023-01-10"),
            published_at: new Date("2023-01-15"),
            updated_at: new Date("2023-01-15"),
            quantity: 30,
            color: {
              color_id: "C-002",
              name: "Đen",
              hex_code: "#000000",
            },
            size: {
              size_id: "S-032",
              name: "32",
            },
          },
        },
      ],
      cart_total_price: 1248000,
    },
    note: "Giao hàng ngoài giờ hành chính",
    payment_method: "cod",
    status: "shipping",
    discount: 50000,
    shipping_fee: 30000,
    final_price: 1228000,
  };

  const handleSaveOrder = (updatedOrder: Order) => {
    console.log("Đơn hàng đã được cập nhật:", updatedOrder);
    // Ở đây bạn có thể gọi API để lưu thay đổi
    alert("Đơn hàng đã được cập nhật thành công!");
  };

  return <EditableOrderDetails order={mockOrder} onSave={handleSaveOrder} />;
};

export default ExampleEditableOrderDetails;
