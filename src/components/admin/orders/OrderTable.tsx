import { Order } from "@/types/cart.type";
import { ShippingAddress } from "@/types/user.type";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface OrderTableProps {
  orders: Order[];
}

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatAddress = (address: ShippingAddress): string => {
  return `${address.address_detail}, ${address.city}`;
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

const getStatusColor = (status: Order["status"]): string => {
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

type SortField = "order_id" | "created_at" | "final_price";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | Order["status"];

export const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <ArrowUpDown className="ml-1 inline h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 inline h-4 w-4 text-indigo-600" />
    ) : (
      <ArrowDown className="ml-1 inline h-4 w-4 text-indigo-600" />
    );
  };

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    // Normalize search term
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    // First filter by status
    let result =
      statusFilter === "all"
        ? orders
        : orders.filter((order) => order.status === statusFilter);

    // Then filter by search term
    if (normalizedSearchTerm) {
      result = result.filter((order) =>
        [
          order.order_id,
          order.shippingAddress.full_name,
          order.shippingAddress.phone_number,
        ].some((field) => field.toLowerCase().includes(normalizedSearchTerm)),
      );
    }

    // Then sort
    return result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "order_id") {
        comparison = a.order_id.localeCompare(b.order_id);
      } else if (sortField === "created_at") {
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === "final_price") {
        comparison = a.final_price - b.final_price;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [orders, sortField, sortDirection, statusFilter, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, endIndex);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPage = (page: number) => setCurrentPage(page);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const getStatusSelectColor = (status: string): string => {
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

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex-1 py-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm đơn hàng..."
              className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Filter className="mr-1 h-4 w-4" /> Lọc theo trạng thái:
          </label>
          <div
            className={`${getStatusSelectColor(statusFilter)} cursor-pointer rounded-md px-2 py-1`}
          >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className={`cursor-pointer rounded-md text-sm shadow-sm transition-all focus:outline-none ${getStatusSelectColor(statusFilter)}`}
            >
              <option value="all" className="bg-white text-[#000]">
                Tất cả
              </option>
              <option
                value="pending_approval"
                className="bg-yellow-100 text-yellow-700"
              >
                Chờ xác nhận
              </option>
              <option value="shipping" className="bg-blue-100 text-blue-700">
                Đang giao hàng
              </option>
              <option value="completed" className="bg-green-100 text-green-700">
                Hoàn thành
              </option>
              <option value="canceled" className="bg-red-100 text-red-700">
                Đã hủy
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th
                className="cursor-pointer py-2 text-left font-medium text-gray-600 hover:text-indigo-600"
                onClick={() => handleSort("order_id")}
              >
                Mã đơn hàng {getSortIcon("order_id")}
              </th>
              <th
                className="cursor-pointer py-2 text-left font-medium text-gray-600 hover:text-indigo-600"
                onClick={() => handleSort("created_at")}
              >
                Ngày đặt {getSortIcon("created_at")}
              </th>
              <th className="py-2 text-left font-medium text-gray-600">
                Khách hàng
              </th>
              <th className="py-2 text-left font-medium text-gray-600">
                Địa chỉ nhận hàng
              </th>
              <th className="py-2 text-left font-medium text-gray-600">
                Trạng thái
              </th>
              <th
                className="cursor-pointer pr-8 text-right font-medium text-gray-600 hover:text-indigo-600"
                onClick={() => handleSort("final_price")}
              >
                Tổng tiền {getSortIcon("final_price")}
              </th>
              <th className="py-2 text-center font-medium text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.order_id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-gray-900">{order.order_id}</td>
                  <td className="py-3 text-gray-900">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <span
                        className="max-w-[120px] truncate"
                        title={order.shippingAddress.full_name}
                      >
                        {order.shippingAddress.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-900">
                    <div
                      className="max-w-[200px] truncate"
                      title={formatAddress(order.shippingAddress)}
                    >
                      {formatAddress(order.shippingAddress)}
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="pl-2 pr-8 text-right font-medium">
                    {formatCurrency(order.final_price)}
                  </td>
                  <td className="py-3 text-center">
                    <div className="jutify-center flex items-center">
                      <Link
                        to={`/admin/orders/${order.order_id}`}
                        className="mx-auto p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAndSortedOrders.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-gray-500">
            <span>
              Hiển thị {startIndex + 1} đến{" "}
              {Math.min(endIndex, filteredAndSortedOrders.length)} của{" "}
              {filteredAndSortedOrders.length} đơn hàng
            </span>
            <div className="ml-4">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-1 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={5}>5 / trang</option>
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className={`rounded p-1 ${
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Trang đầu"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`rounded p-1 ${
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Trang trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-1">
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate the page numbers to display
                let pageNum;

                if (totalPages <= 5) {
                  // If we have 5 or fewer pages, show all of them
                  pageNum = i + 1;
                } else {
                  // For more than 5 pages, we need to calculate which ones to show
                  if (currentPage <= 3) {
                    // Near the start, show 1, 2, 3, 4, 5
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Near the end, show last 5 pages
                    pageNum = totalPages - 4 + i;
                  } else {
                    // In the middle, show current page and 2 pages on each side
                    pageNum = currentPage - 2 + i;
                  }
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`rounded px-3 py-1 text-sm ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`rounded p-1 ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Trang sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className={`rounded p-1 ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Trang cuối"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
