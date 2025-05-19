import { OrderTable } from "@/components/admin/orders/OrderTable";
import { Order } from "@/types/cart";
import { Product } from "@/types/product";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  UsersIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getTopSellingProducts,
  TopSellingProduct,
} from "@/services/client/product/product";
import Loading from "@/components/common/Loading";

// Tạm thời comment phần Chart.js để tránh lỗi
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// Interfaces
interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

interface Cart {
  cart_id: string;
  cartItems: any[]; // Simplified for this component
  cart_total_price: number;
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("weekly");
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const products = await getTopSellingProducts();
        setTopProducts(products);
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  // Mock data
  const stats = [
    {
      title: "Tổng đơn hàng",
      value: "₫255,000",
      change: 18.2,
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Doanh thu tuần",
      value: "₫225,000",
      change: 5.7,
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Đơn đã hoàn thành",
      value: "₫155,000",
      change: 22.5,
      icon: Package,
      color: "blue",
    },
    {
      title: "Khách hàng",
      value: "₫175,000",
      change: -4.75,
      icon: UsersIcon,
      color: "blue",
    },
  ];

  const mockOrders: Order[] = [
    {
      order_id: "ORD-12345",
      created_at: new Date("2023-03-15T10:30:00"),
      shippingAddress: {
        address_id: "ADDR-001",
        full_name: "Nguyễn Văn A",
        phone_number: "0987654321",
        address: "123 Đường Lê Lợi",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        is_default: true,
        created_at: new Date("2023-01-10T08:00:00"),
        updated_at: new Date("2023-03-10T15:00:00"),
      },
      cart: {
        cart_id: "CART-789",
        cartItems: [],
        cart_total_price: 1248000,
      },
      note: "Giao hàng ngoài giờ hành chính",
      payment_method: "cod",
      status: "shipping",
      discount: 50000,
      shipping_fee: 30000,
      final_price: 1228000,
    },
    {
      order_id: "ORD-12346",
      created_at: new Date("2023-03-16T14:20:00"),
      shippingAddress: {
        address_id: "ADDR-002",
        full_name: "Trần Thị B",
        phone_number: "0912345678",
        address: "456 Đường Nguyễn Huệ",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        is_default: false,
        created_at: new Date("2023-02-05T10:30:00"),
        updated_at: new Date("2023-03-15T12:00:00"),
      },
      cart: {
        cart_id: "CART-790",
        cartItems: [],
        cart_total_price: 850000,
      },
      note: null,
      payment_method: "online_payment",
      status: "completed",
      discount: null,
      shipping_fee: 30000,
      final_price: 880000,
    },
    {
      order_id: "ORD-12347",
      created_at: new Date("2023-03-17T09:15:00"),
      shippingAddress: {
        address_id: "ADDR-003",
        full_name: "Lê Văn C",
        phone_number: "0978123456",
        address: "789 Đường Hai Bà Trưng",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        is_default: false,
        created_at: new Date("2023-01-20T09:45:00"),
        updated_at: new Date("2023-03-14T16:30:00"),
      },
      cart: {
        cart_id: "CART-791",
        cartItems: [],
        cart_total_price: 1500000,
      },
      note: "Gọi trước khi giao",
      payment_method: "bank_transfer",
      status: "pending_approval",
      discount: 100000,
      shipping_fee: 30000,
      final_price: 1430000,
    },
    {
      order_id: "ORD-12348",
      created_at: new Date("2023-03-18T16:45:00"),
      shippingAddress: {
        address_id: "ADDR-004",
        full_name: "Phạm Thị D",
        phone_number: "0965432109",
        address: "101 Đường Đồng Khởi",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        is_default: true,
        created_at: new Date("2023-02-15T11:15:00"),
        updated_at: new Date("2023-03-16T09:45:00"),
      },
      cart: {
        cart_id: "CART-792",
        cartItems: [],
        cart_total_price: 750000,
      },
      note: null,
      payment_method: "cod",
      status: "canceled",
      discount: null,
      shipping_fee: 30000,
      final_price: 780000,
    },
  ];

  // Chart data
  const chartData = {
    weekly: {
      labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      datasets: [
        {
          label: "Doanh thu",
          data: [100000, 120000, 110000, 130000, 140000, 180000, 210000],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4,
        },
      ],
    },
    monthly: {
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Doanh thu",
          data: [
            300000, 350000, 320000, 380000, 400000, 450000, 500000, 550000,
            600000, 650000, 700000, 750000,
          ],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4,
        },
      ],
    },
    yearly: {
      labels: ["2019", "2020", "2021", "2022", "2023"],
      datasets: [
        {
          label: "Doanh thu",
          data: [2000000, 2500000, 3000000, 3500000, 4000000],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => "₫" + value.toLocaleString(),
        },
      },
    },
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="mt-1 text-xl font-bold">{stat.value}</h3>
                <div className="mt-1 flex items-center">
                  <span
                    className={`flex items-center text-xs ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    so với 30 ngày trước
                  </span>
                </div>
              </div>
              <div className={`rounded-full bg-blue-100 p-2 text-blue-600`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Chart */}
        <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Biểu đồ doanh thu</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeframe("weekly")}
                className={`rounded-md px-3 py-1 text-sm ${
                  timeframe === "weekly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setTimeframe("monthly")}
                className={`rounded-md px-3 py-1 text-sm ${
                  timeframe === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setTimeframe("yearly")}
                className={`rounded-md px-3 py-1 text-sm ${
                  timeframe === "yearly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Năm
              </button>
            </div>
          </div>
          <div className="flex h-64 items-center justify-center rounded-md bg-gray-50">
            <p className="text-gray-500">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sản phẩm bán chạy</h2>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="flex items-center gap-3"
                >
                  <div className="h-12 w-12 rounded-md bg-gray-200">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-full w-full rounded-md object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-1 font-medium">{product.name}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {product.sale_price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                      <span className="font-medium text-blue-600">
                        Đã bán: {product.totalSold}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
        </div>
        <OrderTable orders={mockOrders}></OrderTable>
      </div>
    </div>
  );
}
