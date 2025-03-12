import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Check, X } from "lucide-react";
import { Outfit, ProductVariant, Product, ProductImage } from "@/types/product";
import ImageSelector from "@/components/admin/ImageSelector";

// Mock data - Trong thực tế sẽ truy vấn từ API
const mockProducts: Product[] = [
  {
    product_id: "p1",
    product_code: "SHT001",
    brand_name: "Brand A",
    name: "Áo sơ mi trắng",
    slug: "ao-so-mi-trang",
    description: "Áo sơ mi nam trắng đơn giản",
    base_price: 299000,
    sale_price: null,
    discount: 0,
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
    collections: [],
    variants: [
      {
        variant_id: "v1",
        variant_code: "SHT001-W-S",
        product_id: "p1",
        image: {
          image_id: "img1",
          image_url: "https://picsum.photos/seed/10/600/852",
          image_name: "white_shirt_s.jpg",
          created_at: new Date(),
          published_at: new Date(),
          updated_at: new Date(),
        },
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
        quantity: 10,
        color: { color_id: "c1", color_name: "Trắng", color_code: "#FFFFFF" },
        size: { size_id: "s1", size_code: "S" },
      },
      {
        variant_id: "v2",
        variant_code: "SHT001-W-M",
        product_id: "p1",
        image: {
          image_id: "img2",
          image_url: "https://picsum.photos/seed/11/600/852",
          image_name: "white_shirt_m.jpg",
          created_at: new Date(),
          published_at: new Date(),
          updated_at: new Date(),
        },
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
        quantity: 15,
        color: { color_id: "c1", color_name: "Trắng", color_code: "#FFFFFF" },
        size: { size_id: "s2", size_code: "M" },
      },
    ],
    variant_images: [],
    outfit: [],
  },
  {
    product_id: "p2",
    product_code: "PNT001",
    brand_name: "Brand B",
    name: "Quần jeans xanh",
    slug: "quan-jeans-xanh",
    description: "Quần jeans nam xanh đậm",
    base_price: 499000,
    sale_price: 399000,
    discount: 20,
    created_at: new Date(),
    published_at: new Date(),
    updated_at: new Date(),
    collections: [],
    variants: [
      {
        variant_id: "v3",
        variant_code: "PNT001-B-M",
        product_id: "p2",
        image: {
          image_id: "img3",
          image_url: "https://picsum.photos/seed/12/600/852",
          image_name: "blue_jeans_m.jpg",
          created_at: new Date(),
          published_at: new Date(),
          updated_at: new Date(),
        },
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
        quantity: 8,
        color: { color_id: "c2", color_name: "Xanh", color_code: "#0000FF" },
        size: { size_id: "s2", size_code: "M" },
      },
      {
        variant_id: "v4",
        variant_code: "PNT001-B-L",
        product_id: "p2",
        image: {
          image_id: "img4",
          image_url: "https://picsum.photos/seed/13/600/852",
          image_name: "blue_jeans_l.jpg",
          created_at: new Date(),
          published_at: new Date(),
          updated_at: new Date(),
        },
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
        quantity: 12,
        color: { color_id: "c2", color_name: "Xanh", color_code: "#0000FF" },
        size: { size_id: "s3", size_code: "L" },
      },
    ],
    outfit: [],
    variant_images: [],
  },
];

// Mock outfits
const mockOutfits: Outfit[] = [
  {
    outfit_id: "1",
    outfit_name: "Bộ đồ mùa hè cơ bản",
    image: {
      image_id: "1",
      image_url: `https://picsum.photos/seed/1/600/852`,
      image_name: "summer_outfit.jpg",
      created_at: new Date(),
      published_at: new Date(),
      updated_at: new Date(),
    },
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    variants: [mockProducts[0].variants[0], mockProducts[1].variants[0]],
  },
  {
    outfit_id: "2",
    outfit_name: "Trang phục công sở",
    image: {
      image_id: "2",
      image_url: `https://picsum.photos/seed/3/600/852`,
      image_name: "office_outfit.jpg",
      created_at: new Date(),
      published_at: new Date(),
      updated_at: new Date(),
    },
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    variants: [mockProducts[0].variants[1]],
  },
];

export default function OutfitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id) && id !== "new";

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
    variants: [],
  });

  const [errors, setErrors] = useState<{
    outfit_name?: string;
    image?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // Load outfit data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      // In real application, fetch data from API
      const existingOutfit = mockOutfits.find((o) => o.outfit_id === id);
      if (existingOutfit) {
        setOutfit(existingOutfit);
      } else {
        // Outfit not found
        navigate("/admin/outfits");
        // toast.error("Không tìm thấy outfit");
      }
    }
  }, [id, isEditMode, navigate]);

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

  const handleImageSelect = (image: ProductImage) => {
    setOutfit({
      ...outfit,
      image: image,
    });
    setShowImageSelector(false);
  };

  const handleAddVariant = (variant: ProductVariant) => {
    if (outfit.variants.some((v) => v.variant_id === variant.variant_id)) {
      // toast.error("Variant đã tồn tại trong outfit");
      return;
    }

    setOutfit({
      ...outfit,
      variants: [...outfit.variants, variant],
    });
  };

  const handleRemoveVariant = (variantId: string) => {
    setOutfit({
      ...outfit,
      variants: outfit.variants.filter((v) => v.variant_id !== variantId),
    });
  };

  const handlePublishToggle = () => {
    setOutfit({
      ...outfit,
      published_at: outfit.published_at ? null : new Date(),
    });
  };

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Chỉnh sửa outfit" : "Tạo outfit mới"}
        </h1>

        <div className="space-y-6">
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Các sản phẩm trong outfit
              </label>
              <button
                onClick={() => setShowVariantSelector(true)}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm sản phẩm
              </button>
            </div>

            {outfit.variants.length > 0 ? (
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
                    {outfit.variants.map((variant) => (
                      <tr key={variant.variant_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="w-12 h-16 overflow-hidden rounded-sm">
                            <img
                              src={variant.image.image_url}
                              alt={variant.variant_code}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {products.find(
                            (p) => p.product_id === variant.product_id
                          )?.name || variant.variant_code}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <span
                              className="w-4 h-4 rounded-full inline-block mr-2"
                              style={{
                                backgroundColor: variant.color.color_code,
                              }}
                            ></span>
                            {variant.color.color_name}
                          </div>
                        </td>
                        <td className="px-4 py-2">{variant.size.size_code}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() =>
                              handleRemoveVariant(variant.variant_id)
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

      {/* Variant Selector Modal */}
      {showVariantSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Chọn sản phẩm cho outfit</h3>
              <button
                onClick={() => setShowVariantSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sản phẩm
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedProduct ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products
                    .find((p) => p.product_id === selectedProduct)
                    ?.variants.map((variant) => (
                      <div
                        key={variant.variant_id}
                        className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-[3/4] bg-gray-100">
                          <img
                            src={variant.image.image_url}
                            alt={variant.variant_code}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {
                              products.find(
                                (p) => p.product_id === variant.product_id
                              )?.name
                            }
                          </h4>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span
                              className="w-3 h-3 rounded-full inline-block mr-1"
                              style={{
                                backgroundColor: variant.color.color_code,
                              }}
                            ></span>
                            {variant.color.color_name} /{" "}
                            {variant.size.size_code}
                          </div>
                          <button
                            onClick={() => handleAddVariant(variant)}
                            className="mt-2 w-full py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Thêm vào outfit
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Vui lòng chọn sản phẩm để xem các biến thể
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowVariantSelector(false)}
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
