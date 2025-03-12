import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Collection, Product } from "@/types/product";
import { ArrowLeft, Save, Plus, X, Search } from "lucide-react";

// Mock products data
const mockProducts: Product[] = Array.from({ length: 30 }, (_, i) => ({
  product_id: (i + 1).toString(),
  product_code: `P00${i + 1}`,
  brand_name: `Brand ${(i % 5) + 1}`,
  name: `Product ${i + 1}`,
  slug: `product-${i + 1}`,
  description: `Description for product ${i + 1}`,
  base_price: 100 + i * 10,
  sale_price: i % 3 === 0 ? 90 + i * 8 : null,
  discount: i % 3 === 0 ? 10 : 0,
  created_at: new Date(),
  published_at: i % 4 === 0 ? null : new Date(),
  updated_at: new Date(),
  collections: [],
  outfit: [],
  variants: [],
  variant_images: [
    {
      image_id: `img-${i + 1}`,
      image_url: "/placeholder.svg",
      image_name: `product-${i + 1}.jpg`,
      created_at: new Date(),
      published_at: new Date(),
      updated_at: new Date(),
    },
  ],
}));

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new";

  const [collection, setCollection] = useState<Collection>({
    collection_id: "",
    name: "",
    slug: "",
    created_at: new Date(),
    published_at: null,
    updated_at: new Date(),
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  // Load collection data
  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, fetch collection by ID
      // For this example, we'll use mock data
      const mockCollections = [
        {
          collection_id: "1",
          name: "Summer Collection",
          slug: "summer-collection",
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          collection_id: "2",
          name: "Winter Essentials",
          slug: "winter-essentials",
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          collection_id: "3",
          name: "Formal Wear",
          slug: "formal-wear",
          published_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          collection_id: "4",
          name: "Casual Basics",
          slug: "casual-basics",
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const foundCollection = mockCollections.find(
        (c) => c.collection_id === id
      );
      if (foundCollection) {
        setCollection(foundCollection);

        // Mock associated products (in a real app, you'd fetch these)
        const associatedProducts = mockProducts.slice(0, 3);
        setSelectedProducts(associatedProducts);
      }
    }
  }, [id, isEditMode]);

  // Update available products
  useEffect(() => {
    // Filter out already selected products
    const selectedIds = selectedProducts.map((p) => p.product_id);
    const filtered = mockProducts.filter(
      (p) => !selectedIds.includes(p.product_id)
    );
    setAvailableProducts(filtered);
  }, [selectedProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollection({ ...collection, [name]: value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection({
      ...collection,
      published_at: e.target.checked ? new Date() : null,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!collection.name) {
      // toast.error("Vui lòng nhập tên bộ sưu tập");
      return;
    }

    // In a real app, this would send data to the backend
    // toast.success(`Bộ sưu tập ${isEditMode ? "cập nhật" : "tạo"} thành công!`);
    navigate("/admin/collections");
  };

  const handleSlugGeneration = () => {
    if (collection.name && !collection.slug) {
      setCollection({
        ...collection,
        slug: collection.name.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  };

  const addProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.product_id !== productId)
    );
  };

  // Filter products for search
  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/collections")}
          className="mr-3 inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? `Chỉnh sửa: ${collection.name}` : "Tạo bộ sưu tập mới"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Thông tin chung</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên bộ sưu tập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={collection.name}
                onChange={handleInputChange}
                onBlur={handleSlugGeneration}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập tên bộ sưu tập"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Đường dẫn
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={collection.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="summer-collection"
              />
              <p className="text-xs text-gray-500 mt-1">
                Được sử dụng trên URL, để trống để tự động tạo.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={collection.published_at !== null}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Đăng bộ sưu tập
              </span>
            </label>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              Sản phẩm ({selectedProducts.length})
            </h2>
            <button
              type="button"
              onClick={() => setIsProductSelectorOpen(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm sản phẩm
            </button>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500">
                Chưa có sản phẩm nào trong bộ sưu tập này
              </p>
              <button
                type="button"
                onClick={() => setIsProductSelectorOpen(true)}
                className="mt-2 inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm sản phẩm
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mã</th>
                    <th className="px-4 py-3 font-medium">Sản phẩm</th>
                    <th className="px-4 py-3 font-medium">Giá</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                    <th className="px-4 py-3 font-medium w-20">Thao tác</th>
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
                              ${product.sale_price}
                            </span>
                            <span className="ml-2 line-through text-gray-500">
                              ${product.base_price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-900">
                            ${product.base_price}
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
                          onClick={() => removeProduct(product.product_id)}
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/collections")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </button>
        </div>
      </form>

      {/* Product Selector Modal */}
      {isProductSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Thêm sản phẩm
              </h3>
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
                              ${product.sale_price}
                            </span>
                            <span className="ml-2 line-through text-gray-500">
                              ${product.base_price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-900">
                            ${product.base_price}
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
      )}
    </div>
  );
}
