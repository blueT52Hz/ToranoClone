import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductSelectorModal } from "../products/ProductSelectorModal";
import { ProductPreview } from "@/types/product.type";
import { Plus } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { CategoryDetail, CategoryFormData } from "@/types/category.type";

interface CategoryProductsProps {
  category: CategoryDetail | null;
  setValue: UseFormSetValue<CategoryFormData>;
}

export const CategoryProducts = ({
  category,
  setValue,
}: CategoryProductsProps) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductPreview[]>(
    [],
  );
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  useEffect(() => {
    if (category) {
      setSelectedProducts(category.products);
      setValue(
        "product_ids",
        category.products.map((p) => p.product_id),
      );
    }
  }, [category, setValue]);

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const newProducts = prev.filter((p) => p.product_id !== productId);
      setValue(
        "product_ids",
        newProducts.map((p) => p.product_id),
      );
      return newProducts;
    });
  };

  const handleAddProduct = (product: ProductPreview) => {
    setSelectedProducts((prev) => {
      const newProducts = [...prev, product];
      setValue(
        "product_ids",
        newProducts.map((p) => p.product_id),
      );
      return newProducts;
    });
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            Sản phẩm ({selectedProducts.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              setIsProductSelectorOpen(true);
            }}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm sản phẩm
          </button>
        </div>

        {selectedProducts.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-200 py-8 text-center">
            <p className="text-gray-500">
              Chưa có sản phẩm nào trong danh mục này
            </p>
            <button
              type="button"
              onClick={() => setIsProductSelectorOpen(true)}
              className="mt-2 inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm sản phẩm
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Mã</th>
                  <th className="px-4 py-3 font-medium">Sản phẩm</th>
                  <th className="px-4 py-3 font-medium">Giá</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="w-20 px-4 py-3 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {product.product_code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="mr-3 h-10 w-10 flex-shrink-0">
                          <img
                            src={product.image.image_url}
                            alt={product.product_name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
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
                        onClick={() => removeProduct(product.product_id)}
                        className="rounded-full p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isProductSelectorOpen && (
        <ProductSelectorModal
          setIsProductSelectorOpen={setIsProductSelectorOpen}
          selectedProducts={selectedProducts}
          handleAddProduct={handleAddProduct}
        />
      )}
    </>
  );
};
