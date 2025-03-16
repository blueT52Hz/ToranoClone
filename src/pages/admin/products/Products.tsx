import React, { useState, useEffect } from "react";
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
import { Image } from "antd";
import { Product } from "@/types/product";
import { getAllProductsWithDetails } from "@/services/admin/product";
import Loading from "@/components/common/Loading";

type SortField = "name" | "product_code" | "base_price" | "created_at";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "published" | "draft";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Fetch products (mock data)
  useEffect(() => {
    // This would be an API call in a real application
    const fetchProducts = async () => {
      setIsLoading(true);
      const result = await getAllProductsWithDetails();
      setProducts(result);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

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
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline text-blue-600" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline text-blue-600" />
    );
  };

  // Format currency
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get total inventory quantity
  const getTotalQuantity = (product: Product): number => {
    return product.variants.reduce((sum, variant) => sum + variant.quantity, 0);
  };

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    // Filter by search term and status
    const filtered = products.filter((product) => {
      // Filter by status
      if (statusFilter === "published" && !product.published_at) {
        return false;
      }
      if (statusFilter === "draft" && product.published_at) {
        return false;
      }

      // Filter by search term
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Sort
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "product_code") {
        comparison = a.product_code.localeCompare(b.product_code);
      } else if (sortField === "base_price") {
        comparison = a.base_price - b.base_price;
      } else if (sortField === "created_at") {
        comparison = a.created_at.getTime() - b.created_at.getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [products, searchTerm, sortField, sortDirection, statusFilter]);

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Filter className="mr-1 h-4 w-4" /> Lọc theo trạng thái:
            </label>
            <div
              className={`${getStatusSelectColor(statusFilter)} rounded-md px-2 py-1 cursor-pointer`}
            >
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className={`text-sm rounded-md shadow-sm cursor-pointer focus:outline-none transition-all ${getStatusSelectColor(statusFilter)}`}
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
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-600">
                  Ảnh
                </th>
                <th
                  className="py-3 px-4 text-left font-medium text-gray-600 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("product_code")}
                >
                  Mã sản phẩm {getSortIcon("product_code")}
                </th>
                <th
                  className="py-3 px-2 text-center font-medium text-gray-600 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("created_at")}
                >
                  Ngày tạo {getSortIcon("created_at")}
                </th>
                <th
                  className="py-3 px-4 text-left font-medium text-gray-600 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("name")}
                >
                  Tên sản phẩm {getSortIcon("name")}
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-600">
                  Tồn kho
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-600">
                  Trạng thái
                </th>
                <th
                  className="py-3 px-4 text-right font-medium text-gray-600 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("base_price")}
                >
                  Giá {getSortIcon("base_price")}
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      {product.variant_images.length > 0 && (
                        <img
                          src={product.variant_images[0].image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {product.product_code}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {product.created_at.toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                          getTotalQuantity(product) > 50
                            ? "bg-green-100 text-green-800"
                            : getTotalQuantity(product) > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getTotalQuantity(product)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                          product.published_at
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.published_at ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      <div>
                        {product.sale_price !== null &&
                          product.sale_price !== product.base_price && (
                            <span className="text-xs line-through text-gray-500 mr-2">
                              {formatCurrency(product.base_price)}
                            </span>
                          )}
                        <span className="font-medium">
                          {formatCurrency(
                            product.sale_price !== null
                              ? product.sale_price
                              : product.base_price
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          to={`/admin/products/${product.product_id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Xem"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product.product_id}/edit`}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 text-center text-gray-500 bg-gray-50"
                  >
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
