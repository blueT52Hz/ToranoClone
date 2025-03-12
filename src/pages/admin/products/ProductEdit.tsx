import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Upload, Plus, Image } from "lucide-react";
import { FormErrors, ProductImage } from "@/types/product";
import { uploadImageToGallery } from "@/services/imageService";
import ImageSelector from "@/components/admin/ImageSelector";

type Product = {
  product_id: string;
  product_code: string;
  brand_name: string;
  name: string;
  description: string;
  base_price: number;
  sale_price: number | null;
  discount: number;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  images: ProductImage[];
  variants: {
    id: number;
    color: string;
    size: string;
    quantity: number;
    image: ProductImage | null;
  }[];
  collections: string[];
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && id !== undefined;

  const [product, setProduct] = useState<Product>({
    product_id: "",
    product_code: "",
    brand_name: "BLUET",
    name: "",
    description: "",
    base_price: 0,
    sale_price: null,
    discount: 0,
    published_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    images: [],
    variants: [{ id: 1, color: "", size: "", quantity: 0, image: null }],
    collections: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  // New state for image selectors
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [isVariantImageSelectorOpen, setIsVariantImageSelectorOpen] =
    useState(false);

  const [availableCollections] = useState([
    { id: "1", name: "Summer Collection" },
    { id: "2", name: "Winter Essentials" },
    { id: "3", name: "Formal Wear" },
    { id: "4", name: "Casual Basics" },
  ]);

  const [availableColors] = useState([
    { color_id: "1", color_name: "Đen", color_code: "#000000" },
    { color_id: "2", color_name: "Trắng", color_code: "#FFFFFF" },
    { color_id: "3", color_name: "Xanh Navy", color_code: "#000080" },
    { color_id: "4", color_name: "Xám", color_code: "#808080" },
  ]);

  const [availableSizes] = useState([
    { size_id: "1", size_code: "S" },
    { size_id: "2", size_code: "M" },
    { size_id: "3", size_code: "L" },
    { size_id: "4", size_code: "XL" },
  ]);

  // Mock data for edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the product data from an API
      setTimeout(() => {
        setProduct({
          product_id: id || "",
          product_code: "TS001",
          brand_name: "BLUET",
          name: "Áo thun nam basic",
          description:
            "Áo thun nam chất liệu cotton 100%, form regular fit, phù hợp với mọi vóc dáng.",
          base_price: 299000,
          sale_price: 249000,
          discount: 17,
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          images: [
            {
              image_id: "1",
              image_url: "/placeholder.svg",
              image_name: "ao-thun-basic-1.jpg",
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
            },
            {
              image_id: "2",
              image_url: "/placeholder.svg",
              image_name: "ao-thun-basic-2.jpg",
              created_at: new Date(),
              published_at: new Date(),
              updated_at: new Date(),
            },
          ],
          variants: [
            {
              id: 1,
              color: "1",
              size: "1",
              quantity: 50,
              image: {
                image_id: "v1",
                image_url: "/placeholder.svg",
                image_name: "ao-thun-basic-den-s.jpg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
              },
            },
            {
              id: 2,
              color: "1",
              size: "2",
              quantity: 45,
              image: {
                image_id: "v2",
                image_url: "/placeholder.svg",
                image_name: "ao-thun-basic-den-m.jpg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
              },
            },
            {
              id: 3,
              color: "2",
              size: "1",
              quantity: 30,
              image: {
                image_id: "v3",
                image_url: "/placeholder.svg",
                image_name: "ao-thun-basic-trang-s.jpg",
                created_at: new Date(),
                published_at: new Date(),
                updated_at: new Date(),
              },
            },
          ],
          collections: ["1", "4"],
        });
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [isEditMode, id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "base_price" || name === "sale_price") {
      const numValue = value === "" ? null : Number.parseFloat(value);
      setProduct((prev) => ({
        ...prev,
        [name]: numValue,
        discount:
          name === "base_price" && prev.sale_price && numValue
            ? Math.round(((numValue - prev.sale_price) / numValue) * 100 * -1)
            : name === "sale_price" && numValue && prev.base_price
              ? Math.round(
                  ((prev.base_price - numValue) / prev.base_price) * 100
                )
              : prev.discount,
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateVariant = (id: number, field: string, value: string | number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const addVariant = () => {
    const newId =
      product.variants.length > 0
        ? Math.max(...product.variants.map((v) => v.id)) + 1
        : 1;
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: newId, color: "", size: "", quantity: 0, image: null },
      ],
    }));
  };

  const removeVariant = (id: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== id),
    }));
  };

  const toggleCollection = (collectionId: string) => {
    setProduct((prev) => {
      if (prev.collections.includes(collectionId)) {
        return {
          ...prev,
          collections: prev.collections.filter((id) => id !== collectionId),
        };
      } else {
        return { ...prev, collections: [...prev.collections, collectionId] };
      }
    });
  };

  // New method to handle opening the image selector
  const openImageSelector = () => {
    setIsImageSelectorOpen(true);
  };

  // Method to handle selecting an image from the gallery
  const handleProductImageSelect = (image: ProductImage) => {
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, image],
    }));

    // Close the selector after selection
    setIsImageSelectorOpen(false);
  };

  // Method for direct image upload (legacy approach, can be removed if not needed)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      try {
        // For each file, upload to gallery and add to product
        const uploadPromises = files.map((file) => uploadImageToGallery(file));
        const newImages = await Promise.all(uploadPromises);

        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  };

  const removeImage = (imageId: string) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.image_id !== imageId),
    }));
  };

  // Method to open variant image selector
  const openVariantImageSelector = (variantId: number) => {
    setSelectedVariant(variantId);
    setIsVariantImageSelectorOpen(true);
  };

  // Method to handle variant image selection from gallery
  const handleVariantImageSelect = (image: ProductImage) => {
    if (selectedVariant !== null) {
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.map((variant) =>
          variant.id === selectedVariant
            ? { ...variant, image: image }
            : variant
        ),
      }));
    }

    setIsVariantImageSelectorOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate product name
    if (!product.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    // Validate product code
    if (!product.product_code.trim()) {
      newErrors.product_code = "Mã sản phẩm không được để trống";
    }

    // Validate base price
    if (!product.base_price || product.base_price <= 0) {
      newErrors.base_price = "Giá gốc phải lớn hơn 0";
    }

    // Validate sale price if provided
    if (
      product.sale_price !== null &&
      product.sale_price >= product.base_price
    ) {
      newErrors.sale_price = "Giá bán phải nhỏ hơn giá gốc";
    }

    // Validate variants
    const variantErrors: {
      [key: number]: { color?: string; size?: string; quantity?: string };
    } = {};
    let hasVariantErrors = false;

    product.variants.forEach((variant) => {
      const variantError: { color?: string; size?: string; quantity?: string } =
        {};

      if (!variant.color) {
        variantError.color = "Vui lòng chọn màu sắc";
        hasVariantErrors = true;
      }

      if (!variant.size) {
        variantError.size = "Vui lòng chọn kích cỡ";
        hasVariantErrors = true;
      }

      if (variant.quantity < 0) {
        variantError.quantity = "Số lượng không được âm";
        hasVariantErrors = true;
      }

      if (Object.keys(variantError).length > 0) {
        variantErrors[variant.id] = variantError;
      }
    });

    if (hasVariantErrors) {
      newErrors.variants = variantErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (publish = false) => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    // Update published status if needed
    if (publish && !product.published_at) {
      setProduct((prev) => ({ ...prev, published_at: new Date() }));
    }

    // In a real app, you would send the data to your API
    setTimeout(() => {
      setIsSaving(false);
      navigate("/products");
    }, 1000);
  };

  const handleDelete = () => {
    // In a real app, you would delete the product via API
    setIsDeleteModalOpen(false);
    navigate("/products");
  };

  const getColorName = (colorId: string) => {
    const color = availableColors.find((c) => c.color_id === colorId);
    return color ? color.color_name : "";
  };

  const getSizeName = (sizeId: string) => {
    const size = availableSizes.find((s) => s.size_id === sizeId);
    return size ? size.size_code : "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Quay lại</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditMode ? `Chỉnh sửa: ${product.name}` : "Thêm sản phẩm mới"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isEditMode && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 mr-2 inline-block" />
                Xóa
              </button>
            )}
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Lưu nháp
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 inline-block" />
                  {isEditMode ? "Cập nhật" : "Xuất bản"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    placeholder="Nhập tên sản phẩm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="product_code"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mã sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="product_code"
                      name="product_code"
                      value={product.product_code}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.product_code ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      placeholder="TS001"
                    />
                    {errors.product_code && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.product_code}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="brand_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Thương hiệu
                    </label>
                    <input
                      type="text"
                      id="brand_name"
                      name="brand_name"
                      value={product.brand_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="BLUET"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Hình ảnh sản phẩm</h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={openImageSelector}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Chọn ảnh
                  </button>

                  <div className="relative">
                    <input
                      type="file"
                      id="product-images"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="product-images"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Tải lên
                    </label>
                  </div>
                </div>
              </div>

              {product.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {product.images.map((image) => (
                    <div key={image.image_id} className="relative group">
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.image_name}
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.image_id)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                      <div
                        className="mt-1 text-xs text-gray-500 truncate"
                        title={image.image_name}
                      >
                        {image.image_name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500">
                    Chưa có hình ảnh nào được thêm vào. Vui lòng chọn ảnh từ thư
                    viện hoặc tải lên ảnh mới.
                  </p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Giá sản phẩm</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="base_price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giá gốc (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="base_price"
                    name="base_price"
                    value={product.base_price || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.base_price ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    placeholder="299000"
                  />
                  {errors.base_price && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.base_price}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="sale_price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giá bán (VND)
                  </label>
                  <input
                    type="number"
                    id="sale_price"
                    name="sale_price"
                    value={product.sale_price || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.sale_price ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    placeholder="249000"
                  />
                  {errors.sale_price && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.sale_price}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={product.discount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Biến thể sản phẩm</h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm biến thể
                </button>
              </div>

              {product.variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="p-4 border border-gray-200 rounded-md mb-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Biến thể {index + 1}</h3>
                    {product.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Màu sắc <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(variant.id, "color", e.target.value)
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.id]?.color ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      >
                        <option value="">Chọn màu</option>
                        {availableColors.map((color) => (
                          <option key={color.color_id} value={color.color_id}>
                            {color.color_name}
                          </option>
                        ))}
                      </select>
                      {errors.variants?.[variant.id]?.color && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants[variant.id].color}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kích cỡ <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(variant.id, "size", e.target.value)
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.id]?.size ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      >
                        <option value="">Chọn kích cỡ</option>
                        {availableSizes.map((size) => (
                          <option key={size.size_id} value={size.size_id}>
                            {size.size_code}
                          </option>
                        ))}
                      </select>
                      {errors.variants?.[variant.id]?.size && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants[variant.id].size}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "quantity",
                            Number.parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.id]?.quantity ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                        placeholder="50"
                        min="0"
                      />
                      {errors.variants?.[variant.id]?.quantity && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants[variant.id].quantity}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh biến thể
                      </label>
                      {variant.image ? (
                        <div
                          className="relative group h-20 w-20 cursor-pointer"
                          onClick={() => openVariantImageSelector(variant.id)}
                        >
                          <img
                            src={variant.image.image_url || "/placeholder.svg"}
                            alt={`${getColorName(variant.color)} ${getSizeName(variant.size)}`}
                            className="w-full h-full object-cover rounded-md border border-gray-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                            <p className="text-white text-xs">Thay đổi</p>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openVariantImageSelector(variant.id)}
                          className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 focus:outline-none"
                        >
                          <Image className="h-8 w-8 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Publishing */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Xuất bản</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={product.published_at !== null}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          published_at: e.target.checked ? new Date() : null,
                        }))
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {product.published_at !== null
                        ? "Đã xuất bản"
                        : "Bản nháp"}
                    </span>
                  </label>
                </div>

                {isEditMode && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Ngày tạo: {product.created_at.toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cập nhật lần cuối:{" "}
                      {product.updated_at.toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Collections */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Bộ sưu tập</h2>
              <div className="space-y-2">
                {availableCollections.map((collection) => (
                  <label
                    key={collection.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-600"
                      checked={product.collections.includes(collection.id)}
                      onChange={() => toggleCollection(collection.id)}
                    />
                    <span className="text-sm">{collection.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Variants Summary */}
            {product.variants.length > 0 && (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Tóm tắt biến thể</h2>
                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="p-3 border border-gray-200 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {getColorName(variant.color)} /{" "}
                            {getSizeName(variant.size)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {variant.quantity}
                          </p>
                        </div>
                        {variant.image && (
                          <img
                            src={variant.image.image_url || "/placeholder.svg"}
                            alt={`${getColorName(variant.color)} ${getSizeName(variant.size)}`}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm "{product.name}" không? Hành
                động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Selector Modal */}
        {isImageSelectorOpen && (
          <ImageSelector
            onImageSelect={handleProductImageSelect}
            onCancel={() => setIsImageSelectorOpen(false)}
            selectedImages={product.images}
            title="Chọn hình ảnh sản phẩm"
            multiple={true}
          />
        )}

        {/* Variant Image Selector Modal */}
        {isVariantImageSelectorOpen && selectedVariant !== null && (
          <ImageSelector
            onImageSelect={handleVariantImageSelect}
            onCancel={() => setIsVariantImageSelectorOpen(false)}
            selectedImages={
              product.variants.find((v) => v.id === selectedVariant)?.image
                ? [
                    product.variants.find((v) => v.id === selectedVariant)!
                      .image!,
                  ]
                : []
            }
            title={`Chọn hình ảnh cho biến thể ${
              product.variants.find((v) => v.id === selectedVariant)?.color &&
              getColorName(
                product.variants.find((v) => v.id === selectedVariant)?.color ||
                  ""
              )
            } / ${
              product.variants.find((v) => v.id === selectedVariant)?.size &&
              getSizeName(
                product.variants.find((v) => v.id === selectedVariant)?.size ||
                  ""
              )
            }`}
            multiple={false}
          />
        )}
      </div>
    </div>
  );
}
