import Loading from "@/components/common/Loading";
import { getAllProductsWithDetails } from "@/services/admin/product";
import { Product } from "@/types/product";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ProductSelectorModalProps {
  setIsProductSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProducts: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const ProductSelectorModal = ({
  setIsProductSelectorOpen,
  selectedProducts,
  setSelectedProducts,
}: ProductSelectorModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProductIds = useMemo(() => {
    return selectedProducts.map((product) => product.product_id);
  }, [selectedProducts]);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      const allProductsResult = await getAllProductsWithDetails();
      setAllProducts(allProductsResult);
      setAvailableProducts(
        allProductsResult.filter(
          (product) => !selectedProductIds.includes(product.product_id)
        )
      );
      setIsLoading(false);
    };
    getProduct();
  }, [selectedProducts]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableProducts, searchTerm]);

  const addProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Thêm sản phẩm</h3>
          <button
            onClick={() => setIsProductSelectorOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="search"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-y-auto flex-grow">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Mã</th>
                  <th className="px-4 py-3 font-medium">Sản phẩm</th>
                  <th className="px-4 py-3 font-medium">Giá</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium w-20">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {product.product_code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {product.variant_images[0] && (
                            <img
                              src={product.variant_images[0].image_url}
                              alt={product.name}
                              className="h-10 w-10 object-cover rounded-md"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.brand_name}
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
                          <span className="ml-2 line-through text-gray-500">
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
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          product.published_at
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.published_at ? "Đã đăng" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          addProduct(product);
                          setIsProductSelectorOpen(false);
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Thêm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsProductSelectorOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
