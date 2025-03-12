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
import { Product } from "@/types/product";

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
    setTimeout(() => {
      setProducts([
        {
          product_id: "1",
          product_code: "TS001",
          brand_name: "BLUET",
          name: "Áo thun nam basic",
          slug: "ao-thun-nam-basic",
          description: "Áo thun nam chất liệu cotton 100%",
          base_price: 299000,
          sale_price: 249000,
          discount: 17,
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          collections: [],
          variants: [
            {
              variant_id: "v1",
              variant_code: "TS001-BL-S",
              product_id: "1",
              quantity: 50,
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              color: {
                color_id: "1",
                color_name: "Đen",
                color_code: "#000000",
              },
              size: { size_id: "1", size_code: "S" },
              image: {
                image_id: "img1",
                image_url: "/placeholder.svg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
                image_name: "",
              },
            },
          ],

          outfit: [],
          variant_images: [
            {
              image_id: "img1",
              image_url: "/placeholder.svg",
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              image_name: "",
            },
          ],
        },
        {
          product_id: "2",
          product_code: "TS002",
          brand_name: "BLUET",
          name: "Áo sơ mi nam trắng",
          slug: "ao-so-mi-nam-trang",
          description: "Áo sơ mi nam trắng chất liệu cotton",
          base_price: 399000,
          sale_price: 399000,
          discount: 0,
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          collections: [],
          variants: [
            {
              variant_id: "v2",
              variant_code: "TS002-WT-M",
              product_id: "2",
              quantity: 75,
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              color: {
                color_id: "2",
                color_name: "Trắng",
                color_code: "#FFFFFF",
              },
              size: { size_id: "2", size_code: "M" },
              image: {
                image_id: "img2",
                image_url: "/placeholder.svg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
                image_name: "",
              },
            },
          ],

          outfit: [],
          variant_images: [
            {
              image_id: "img2",
              image_url: "/placeholder.svg",
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              image_name: "",
            },
          ],
        },
        {
          product_id: "3",
          product_code: "QS001",
          brand_name: "BLUET",
          name: "Quần jeans nam slim fit",
          slug: "quan-jeans-nam-slim-fit",
          description: "Quần jeans nam slim fit chất liệu denim",
          base_price: 599000,
          sale_price: 499000,
          discount: 17,
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          collections: [],
          variants: [
            {
              variant_id: "v3",
              variant_code: "QS001-BL-L",
              product_id: "3",
              quantity: 1,
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              color: {
                color_id: "1",
                color_name: "Đen",
                color_code: "#000000",
              },
              size: { size_id: "3", size_code: "L" },
              image: {
                image_id: "img3",
                image_url: "/placeholder.svg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
              },
            },
            {
              variant_id: "v4",
              variant_code: "QS001-BL-L",
              product_id: "3",
              quantity: 1,
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              color: {
                color_id: "1",
                color_name: "Đen",
                color_code: "#000000",
              },
              size: { size_id: "3", size_code: "L" },
              image: {
                image_name: "",
                image_id: "img3",
                image_url: "/placeholder.svg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
              },
            },
          ],

          outfit: [],
          variant_images: [
            {
              image_id: "img3",
              image_url: "/placeholder.svg",
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              image_name: "",
            },
          ],
        },
        {
          product_id: "4",
          product_code: "QS002",
          brand_name: "BLUET",
          name: "Quần kaki nam",
          slug: "quan-kaki-nam",
          description: "Quần kaki nam chất liệu cotton",
          base_price: 499000,
          sale_price: null,
          discount: 0,
          published_at: null,
          created_at: new Date(),
          updated_at: new Date(),
          collections: [],
          variants: [
            {
              variant_id: "v4",
              variant_code: "QS002-GR-L",
              product_id: "4",
              quantity: 80,
              created_at: new Date(),
              published_at: null,
              updated_at: new Date(),
              color: {
                color_id: "4",
                color_name: "Xám",
                color_code: "#808080",
              },
              size: { size_id: "3", size_code: "L" },
              image: {
                image_id: "img4",
                image_url: "/placeholder.svg",
                created_at: new Date(),
                published_at: null,
                updated_at: new Date(),
                image_name: "",
              },
            },
          ],

          outfit: [],
          variant_images: [
            {
              image_id: "img4",
              image_url: "/placeholder.svg",
              created_at: new Date(),
              published_at: null,
              updated_at: new Date(),
              image_name: "",
            },
          ],
        },
        {
          product_id: "5",
          product_code: "GT001",
          brand_name: "BLUET",
          name: "Giày thể thao nam",
          slug: "giay-the-thao-nam",
          description: "Giày thể thao nam chất liệu canvas",
          base_price: 899000,
          sale_price: 799000,
          discount: 11,
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          collections: [],
          variants: [
            {
              variant_id: "v5",
              variant_code: "GT001-BL-42",
              product_id: "5",
              quantity: 30,
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              color: {
                color_id: "1",
                color_name: "Đen",
                color_code: "#000000",
              },
              size: { size_id: "4", size_code: "42" },
              image: {
                image_id: "img5",
                image_url: "/placeholder.svg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
                image_name: "",
              },
            },
          ],

          outfit: [],
          variant_images: [
            {
              image_id: "img5",
              image_url: "/placeholder.svg",
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
              image_name: "",
            },
          ],
        },
      ]);
      setIsLoading(false);
    }, 1000);
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
                  className="py-3 px-4 text-center font-medium text-gray-600 cursor-pointer hover:text-blue-600"
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
