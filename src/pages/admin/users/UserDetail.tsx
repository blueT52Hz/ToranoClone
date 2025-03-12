"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Search,
  Edit,
  Mail,
  Phone,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

type Order = {
  order_id: string;
  created_at: Date;
  status: "pending_approval" | "shipping" | "completed" | "canceled";
  payment_method: string;
  final_price: number;
};

type User = {
  user_id: string;
  full_name: string;
  gender: "Nam" | "Nữ" | "Khác";
  date_of_birth: Date;
  email: string;
  phone: string;
  created_at: Date;
  orders_count: number;
  total_spent: number;
  shipping_addresses: {
    id: string;
    address: string;
    is_default: boolean;
  }[];
  orders: Order[];
};

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Mock data
  useEffect(() => {
    // In a real app, you would fetch the user data from an API
    setTimeout(() => {
      setUser({
        user_id: userId,
        full_name: "Nguyễn Văn A",
        gender: "Nam",
        date_of_birth: new Date("1990-01-15"),
        email: "nguyenvana@example.com",
        phone: "0901234567",
        created_at: new Date("2023-01-10"),
        orders_count: 5,
        total_spent: 2500000,
        shipping_addresses: [
          {
            id: "1",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            is_default: true,
          },
          {
            id: "2",
            address: "456 Đường XYZ, Quận 2, TP.HCM",
            is_default: false,
          },
        ],
        orders: [
          {
            order_id: "#ORD001",
            created_at: new Date("2023-07-15"),
            status: "completed",
            payment_method: "Thanh toán khi nhận hàng",
            final_price: 550000,
          },
          {
            order_id: "#ORD002",
            created_at: new Date("2023-06-20"),
            status: "completed",
            payment_method: "Chuyển khoản ngân hàng",
            final_price: 750000,
          },
          {
            order_id: "#ORD003",
            created_at: new Date("2023-05-10"),
            status: "canceled",
            payment_method: "Thanh toán trực tuyến",
            final_price: 425000,
          },
          {
            order_id: "#ORD004",
            created_at: new Date("2023-04-05"),
            status: "completed",
            payment_method: "Thanh toán khi nhận hàng",
            final_price: 890000,
          },
          {
            order_id: "#ORD005",
            created_at: new Date("2023-03-15"),
            status: "completed",
            payment_method: "Thanh toán trực tuyến",
            final_price: 1250000,
          },
        ],
      });
      setIsLoading(false);
    }, 500);
  }, [userId]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_approval":
        return "Chờ xác nhận";
      case "shipping":
        return "Đang giao";
      case "completed":
        return "Hoàn thành";
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_approval":
        return "bg-yellow-100 text-yellow-700";
      case "shipping":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filter and sort orders
  let filteredOrders =
    user?.orders.filter((order) =>
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (sortField) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      let aValue: any = a[sortField as keyof Order];
      let bValue: any = b[sortField as keyof Order];

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/users"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Quay lại</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{user.full_name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/users/edit/${user.user_id}`}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            <Edit className="w-4 h-4 mr-2 inline-block" />
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Thông tin cá nhân</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
              <p className="font-medium">{user.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Giới tính</p>
              <p className="font-medium">{user.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
              <p className="font-medium">{formatDate(user.date_of_birth)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày đăng ký</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <a
                href={`mailto:${user.email}`}
                className="text-blue-600 hover:underline"
              >
                {user.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <a
                href={`tel:${user.phone}`}
                className="text-blue-600 hover:underline"
              >
                {user.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Shipping Addresses */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Địa chỉ giao hàng</h2>
          <div className="space-y-4">
            {user.shipping_addresses.map((address) => (
              <div
                key={address.id}
                className="p-3 border border-gray-200 rounded-md"
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium">{address.address}</p>
                  {address.is_default && (
                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      Mặc định
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Thống kê</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-blue-700">
                {user.orders_count}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                Tổng chi tiêu
              </p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(user.total_spent)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <h2 className="text-lg font-medium">Lịch sử đơn hàng</h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("order_id")}
                >
                  <div className="flex items-center">
                    Mã đơn hàng
                    {sortField === "order_id" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Ngày đặt
                    {sortField === "created_at" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Trạng thái
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("payment_method")}
                >
                  <div className="flex items-center">
                    Phương thức thanh toán
                    {sortField === "payment_method" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer text-right"
                  onClick={() => handleSort("final_price")}
                >
                  <div className="flex items-center justify-end">
                    Tổng tiền
                    {sortField === "final_price" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {order.order_id}
                  </td>
                  <td className="px-4 py-3">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.payment_method}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(order.final_price)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/orders/${order.order_id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
