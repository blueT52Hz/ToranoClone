import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Edit,
  Plus,
  Search,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Filter,
} from "lucide-react";
import { ProductPreview } from "@/types/product.type";
import Loading from "@/components/common/Loading";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/apis/admin/product.api";
import placeholderImage from "@/assets/images/placeholder.svg";
import Pagination from "@/components/common/Pagination";

type SortBy =
  | "product_name"
  | "product_code"
  | "created_at"
  | "updated_at"
  | "price"
  | "discount"
  | "quantity_total"
  | "quantity_min"
  | "status";
type SortOrder = "asc" | "desc";
type Status = "all" | "published" | "draft";

const ProductList = () => {
  const [products, setProducts] = useState<ProductPreview[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [status, setStatus] = useState<Status>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    data: productsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      productApi.getProducts(1, 10, search, status, sortBy, sortOrder),
  });

  useEffect(() => {
    refetch();
  }, [sortBy, sortOrder, status, search, refetch]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data.data.products);
      setTotalPages(productsData.data.data.pagination.totalPages);
    }
  }, [productsData]);

  // Get sort icon
  const getSortIcon = (field: SortBy) => {
    if (field !== sortBy) {
      return <ArrowUpDown className="ml-1 inline h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 inline h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="ml-1 inline h-4 w-4 text-blue-600" />
    );
  };

  // Format currency
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get status background color
  const getStatusSelectColor = (status: string): string => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-4 sm:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Filter className="mr-1 h-4 w-4" /> Lọc theo trạng thái:
            </label>
            <div
              className={`${getStatusSelectColor(status)} cursor-pointer rounded-md px-2 py-1`}
            >
              <select
                title="Trạng thái"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className={`cursor-pointer rounded-md text-sm shadow-sm transition-all focus:outline-none ${getStatusSelectColor(status)}`}
              >
                <option value="all" className="bg-white text-[#000]">
                  Tất cả
                </option>
                <option
                  value="published"
                  className="bg-green-100 text-green-700"
                >
                  Đã xuất bản
                </option>
                <option value="draft" className="bg-gray-100 text-gray-700">
                  Bản nháp
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Ảnh
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left font-medium text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    setSortBy("product_code");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Mã sản phẩm {getSortIcon("product_code")}
                </th>
                <th
                  className="cursor-pointer px-2 py-3 text-center font-medium text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    setSortBy("created_at");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Ngày tạo {getSortIcon("created_at")}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left font-medium text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    setSortBy("product_name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Tên sản phẩm {getSortIcon("product_name")}
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">
                  Tồn kho
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">
                  Trạng thái
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-right font-medium text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    setSortBy("price");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Giá {getSortIcon("price")}
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={product?.image?.image_url || placeholderImage}
                        alt={product.product_name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {product.product_code}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {new Date(product.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {product.product_name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                          product.quantity_total > 50
                            ? "bg-green-100 text-green-800"
                            : product.quantity_total > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity_total}
                      </span>{" "}
                      |{" "}
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                          product.quantity_min > 50
                            ? "bg-green-100 text-green-800"
                            : product.quantity_min > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity_min}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                          product.product_status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.product_status === "published"
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      <div>
                        {product.sale_price !== null &&
                          product.sale_price !== product.base_price && (
                            <span className="mr-2 text-xs text-gray-500 line-through">
                              {formatCurrency(product.base_price)}
                            </span>
                          )}
                        <span className="font-medium">
                          {formatCurrency(
                            product.sale_price !== null
                              ? product.sale_price
                              : product.base_price,
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          to={`/admin/products/${product.product_id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Xem"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product.product_id}/edit`}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="bg-gray-50 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
