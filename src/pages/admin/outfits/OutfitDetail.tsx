import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Check, X } from "lucide-react";
import { Outfit, Product, Image } from "@/types/product";
import ImageSelector from "@/components/admin/ImageSelector";
import { getOutfitById } from "@/services/admin/outfit";
import { getProductsByOutfitId } from "@/services/admin/product";

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
  const [products, setProducts] = useState<Product[]>([]);

  // State cho lỗi và loading
  const [errors, setErrors] = useState<{
    outfit_name?: string;
    image?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // State cho việc hiển thị modal chọn ảnh
  const [showImageSelector, setShowImageSelector] = useState(false);

  // Load dữ liệu outfit và các sản phẩm khi vào trang chỉnh sửa
  useEffect(() => {
    if (isEditMode && id) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const outfitData = await getOutfitById(id);
          setOutfit(outfitData);

          const productsData = await getProductsByOutfitId(id);
          setProducts(productsData);
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

    if (!outfit.outfit_name.trim()) {
      newErrors.outfit_name = "Tên outfit không được để trống";
    }

    if (!outfit.image.image_url) {
      newErrors.image = "Hình ảnh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý lưu outfit
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Mock API save
      setTimeout(() => {
        if (isEditMode) {
          // toast.success("Cập nhật outfit thành công!");
        } else {
          // toast.success("Tạo outfit mới thành công!");
        }
        navigate("/admin/outfits");
      }, 1000);
    } catch (error) {
      console.error("Error saving outfit:", error);
      // toast.error("Đã xảy ra lỗi khi lưu outfit");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý chọn ảnh
  const handleImageSelect = (image: Image) => {
    setOutfit({
      ...outfit,
      image: image,
    });
    setShowImageSelector(false);
  };

  // Xử lý thêm/xóa sản phẩm
  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter((product) => product.product_id !== productId));
  };

  // Xử lý đăng/hủy đăng outfit
  const handlePublishToggle = () => {
    setOutfit({
      ...outfit,
      published_at: outfit.published_at ? null : new Date(),
    });
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
            {outfit.published_at ? (
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
              value={outfit.outfit_name}
              onChange={(e) =>
                setOutfit({ ...outfit, outfit_name: e.target.value })
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
                {outfit.image.image_url ? (
                  <img
                    src={outfit.image.image_url}
                    alt={outfit.outfit_name}
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
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Các sản phẩm trong outfit
              </label>
              <button
                onClick={() => setShowImageSelector(true)}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm sản phẩm
              </button>
            </div>

            {products.length > 0 ? (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 font-medium">Hình ảnh</th>
                      <th className="px-4 py-2 font-medium">Sản phẩm</th>
                      <th className="px-4 py-2 font-medium">Màu sắc</th>
                      <th className="px-4 py-2 font-medium">Kích cỡ</th>
                      <th className="px-4 py-2 font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.product_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="w-12 h-16 overflow-hidden rounded-sm">
                            <img
                              src={product.variant_images[0]?.image_url || ""}
                              alt={product.product_code}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <span
                              className="w-4 h-4 rounded-full inline-block mr-2"
                              style={{
                                backgroundColor:
                                  product.variants[0]?.color.color_code ||
                                  "#ccc",
                              }}
                            ></span>
                            {product.variants[0]?.color.color_name || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {product.variants[0]?.size.size_code || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() =>
                              handleRemoveProduct(product.product_id)
                            }
                            className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-md py-8 text-center">
                <p className="text-gray-500">
                  Chưa có sản phẩm nào trong outfit
                </p>
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
    </div>
  );
}
