import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Check, X } from "lucide-react";
import { Outfit, Product, Image } from "@/types/product";
import ImageSelector from "@/components/admin/ImageSelector";
import {
  addOutfit,
  getOutfitById,
  updateOutfit,
} from "@/services/admin/outfit";
import { getProductsByOutfitId } from "@/services/admin/product";
import { ProductSelectorModal } from "@/components/admin/products/ProductSelectorModal";

interface OutfitForm {
  name: string;
  image: Image;
  productIds: string[];
}

export default function OutfitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id ? true : false;

  // State cho outfit
  const [outfit, setOutfit] = useState<Outfit>({
    outfit_id: "",
    outfit_name: "",
    image: {
      image_id: "",
      image_url: "",
      image_name: "",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    published_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // State cho các sản phẩm trong outfit
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isPublish, setIsPublish] = useState(false);

  // State cho lỗi và loading
  const [errors, setErrors] = useState<{
    outfit_name?: string;
    image?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // State cho việc hiển thị modal chọn ảnh
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  const [outfitForm, setOutfitForm] = useState<OutfitForm>({
    name: "",
    image: {
      image_id: "",
      image_url: "",
      image_name: "",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    productIds: [],
  });

  // Load dữ liệu outfit và các sản phẩm khi vào trang chỉnh sửa
  useEffect(() => {
    if (isEditMode && id) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const outfitData = await getOutfitById(id);
          setOutfit(outfitData);

          const productsData = await getProductsByOutfitId(id);
          setSelectedProducts(productsData);
          setOutfitForm({
            name: outfitData.outfit_name,
            image: outfitData.image,
            productIds: productsData.map((product) => product.product_id),
          });
          setIsPublish(outfitData.published_at !== null);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [id, isEditMode]);

  // Validate form
  const validateForm = () => {
    const newErrors: { outfit_name?: string; image?: string } = {};

    if (!outfitForm.name.trim()) {
      newErrors.outfit_name = "Tên outfit không được để trống";
    }

    if (!outfitForm.image?.image_url) {
      newErrors.image = "Hình ảnh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý lưu outfit
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    if (isEditMode) {
      const submit = async () => {
        const result = await updateOutfit(
          outfit.outfit_id,
          {
            outfit_name: outfitForm.name,
            image_id: outfitForm.image?.image_id,
            published_at: isPublish
              ? outfit.published_at !== null
                ? outfit.published_at
                : new Date()
              : null,
          },
          selectedProducts.map((product) => product.product_id)
        );
      };
      submit();
    } else {
      const submit = async () => {
        const result = await addOutfit(
          {
            outfit_name: outfitForm.name,
            image_id: outfitForm.image?.image_id,
            published_at: isPublish ? new Date() : null,
          },
          selectedProducts.map((product) => product.product_id)
        );
      };
      submit();
    }
    navigate("/admin/outfits");

    setIsLoading(false);
  };

  // Xử lý chọn ảnh
  const handleImageSelect = (image: Image) => {
    setOutfitForm({ ...outfitForm, image: image });
    setShowImageSelector(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.product_id !== productId)
    );
    console.log(selectedProducts);
  };

  // Xử lý đăng/hủy đăng outfit
  const handlePublishToggle = () => {
    setIsPublish(!isPublish);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/outfits")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePublishToggle}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              outfit.published_at
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isPublish ? (
              <>
                <X className="w-4 h-4 inline mr-1" />
                Hủy đăng
              </>
            ) : (
              <>
                <Check className="w-4 h-4 inline mr-1" />
                Đăng bán
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang lưu...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Chỉnh sửa outfit" : "Tạo outfit mới"}
        </h1>

        <div className="space-y-6">
          {/* Tên outfit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên outfit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={outfitForm.name}
              onChange={(e) =>
                setOutfitForm({ ...outfitForm, name: e.target.value })
              }
              className={`w-full px-3 py-2 border ${
                errors.outfit_name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
              placeholder="Nhập tên outfit"
            />
            {errors.outfit_name && (
              <p className="mt-1 text-sm text-red-500">{errors.outfit_name}</p>
            )}
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start">
              <div
                className={`border ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } rounded-md overflow-hidden w-[150px] h-[200px] relative`}
              >
                {outfitForm.image?.image_url ? (
                  <img
                    src={outfitForm.image.image_url}
                    alt={outfitForm.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <span className="text-gray-400 text-sm">
                      Chưa có hình ảnh
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowImageSelector(true)}
                className="ml-4 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                Chọn ảnh
              </button>
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Danh sách sản phẩm */}
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
                  Chưa có sản phẩm nào trong Outfit này
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
                              {product.variant_images.length > 0 && (
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
        </div>
      </div>

      {/* Image Selector Modal */}
      {showImageSelector && (
        <ImageSelector
          onImageSelect={handleImageSelect}
          onCancel={() => setShowImageSelector(false)}
          selectedImages={[outfit.image]}
          title="Chọn hình ảnh cho outfit"
        />
      )}

      {isProductSelectorOpen && (
        <ProductSelectorModal
          setIsProductSelectorOpen={setIsProductSelectorOpen}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}
    </div>
  );
}
