import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Mail,
  Phone,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { supabase } from "@/services/supabaseClient";

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
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Lấy dữ liệu từ Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);

      try {
        // Lấy thông tin người dùng
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (userError) throw userError;

        // Lấy đơn hàng của người dùng
        const { data: ordersData, error: ordersError } = await supabase
          .from("order")
          .select("*")
          .eq("user_id", userId);

        if (ordersError) throw ordersError;

        // Lấy địa chỉ giao hàng
        const { data: addressesData, error: addressesError } = await supabase
          .from("shipping_address")
          .select("*")
          .eq("user_id", userId);

        if (addressesError) throw addressesError;

        // Cập nhật state
        setUser({
          ...userData,
          orders: ordersData,
          shipping_addresses: addressesData,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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
      {/* Phần header và thông tin người dùng */}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Thông tin cá nhân</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
              <p className="font-medium">{user.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Giới tính</p>
              <p className="font-medium">{"Nam"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
              <p className="font-medium">
                {formatDate(new Date(user.date_of_birth))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày đăng ký</p>
              <p className="font-medium">
                {formatDate(new Date(user.created_at))}
              </p>
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
            {/* <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <a
                href={`tel:${user.phone}`}
                className="text-blue-600 hover:underline"
              >
                {user.phone}
              </a>
            </div> */}
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 col-span-2">
          <h2 className="text-lg font-medium mb-4">Địa chỉ giao hàng</h2>
          <div className="space-y-4">
            {user.shipping_addresses.map((address, index) => (
              <div
                key={index}
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
      </div>

      {/* Lịch sử đơn hàng */}
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
                    {sortField === "order_id" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Ngày đặt
                    {sortField === "created_at" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Trạng thái
                    {sortField === "status" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("payment_method")}
                >
                  <div className="flex items-center">
                    Phương thức thanh toán
                    {sortField === "payment_method" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
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
                  <td className="px-4 py-3">
                    {formatDate(new Date(order.created_at))}
                  </td>
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
                    <button
                      onClick={() =>
                        navigate(`/admin/orders/${order.order_id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Xem chi tiết
                    </button>
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
