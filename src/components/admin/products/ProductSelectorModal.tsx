import Loading from "@/components/common/Loading";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductPreview } from "@/types/product.type";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/apis/admin/product.api";

interface ProductSelectorModalProps {
  setIsProductSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProducts: ProductPreview[];
  handleAddProduct: (product: ProductPreview) => void;
}

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

export const ProductSelectorModal = ({
  setIsProductSelectorOpen,
  selectedProducts,
  handleAddProduct,
}: ProductSelectorModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductPreview[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [status, setStatus] = useState<Status>("all");

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", searchTerm, status, sortBy, sortOrder],
    queryFn: () =>
      productApi.getProducts(1, 10, searchTerm, status, sortBy, sortOrder),
  });

  useEffect(() => {
    if (productsData) {
      setProducts(
        productsData.data.data.products.filter(
          (product) => !selectedProducts.includes(product),
        ),
      );
    }
  }, [productsData, selectedProducts]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Thêm sản phẩm</h3>
          <button
            title="Đóng"
            onClick={() => setIsProductSelectorOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="search"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
            className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sắp xếp theo:</label>
            <select
              title="Sắp xếp theo"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="product_name">Tên sản phẩm</option>
              <option value="product_code">Mã sản phẩm</option>
              <option value="created_at">Ngày tạo</option>
              <option value="updated_at">Ngày cập nhật</option>
              <option value="price">Giá</option>
              <option value="discount">Giảm giá</option>
              <option value="quantity_total">Tổng số lượng</option>
              <option value="quantity_min">Số lượng tối thiểu</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Thứ tự:</label>
            <select
              title="Thứ tự"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Trạng thái:</label>
            <select
              title="Trạng thái"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="published">Đã đăng</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Mã</th>
                  <th className="px-4 py-3 font-medium">Sản phẩm</th>
                  <th className="px-4 py-3 font-medium">Giá</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="w-20 px-4 py-3 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {product.product_code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="mr-3 h-10 w-10 flex-shrink-0">
                          {product.image.image_url && (
                            <img
                              src={product.image.image_url}
                              alt={product.product_name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.product_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.sale_price ? (
                        <div>
                          <span className="text-gray-900">
                            {product.sale_price}₫
                          </span>
                          <span className="ml-2 text-gray-500 line-through">
                            {product.base_price}₫
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-900">
                          {product.base_price}₫
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs ${
                          product.product_status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.product_status === "published"
                          ? "Đã đăng"
                          : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          handleAddProduct(product);
                          setIsProductSelectorOpen(false);
                        }}
                        className="inline-flex items-center rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Thêm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsProductSelectorOpen(false)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
