import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Upload, Plus, Image } from "lucide-react";
import {
  Collection,
  Color,
  FormErrors,
  Image as ImageType,
  Product,
  ProductVariant,
  Size,
} from "@/types/product";
import { uploadImageToGallery } from "@/services/admin/gallery";
import ImageSelector from "@/components/admin/ImageSelector";
import {
  addProductWithDetails,
  getProductById,
} from "@/services/admin/product";
import { getAllCollections } from "@/services/admin/collection";
import { v4 } from "uuid";
import { getCollectionById } from "@/services/collection-controller";
import { getAllColors } from "@/services/admin/color";
import { getAllSizes } from "@/services/admin/size";
import { notification } from "antd";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && id !== undefined;

  const [product, setProduct] = useState<Product>({
    product_id: "",
    product_code: "",
    brand_name: "",
    slug: "",
    name: "",
    description: "",
    base_price: 0,
    sale_price: null,
    discount: 0,
    published_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    variant_images: [],
    variants: [],
    collections: [],
    outfits: [],
  });

  const [errors, setErrors] = useState<
    FormErrors & {
      variants?: {
        [key: string]: { color?: string; size?: string; quantity?: string };
      };
    }
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // danh sách collection chọn
  const [collectionSelectedIds, setCollectionSelectedIds] = useState<string[]>(
    []
  );

  // danh sách tất cả collection
  const [availableCollections, setAvailableCollections] = useState<
    Collection[]
  >([]);

  // New state for image selectors
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [isVariantImageSelectorOpen, setIsVariantImageSelectorOpen] =
    useState(false);

  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);

  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the product data from an API
      const getProduct = async () => {
        const result = await getProductById(id);
        setProduct(result);
        setCollectionSelectedIds([
          ...collectionSelectedIds,
          ...product.collections.map((collection) => collection.collection_id),
        ]);
        setVariants([...product.variants]);
      };
      getProduct();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Mock data for edit mode
  useEffect(() => {
    const getColorSizeCollection = async () => {
      const allCollections = await getAllCollections();
      const allColors = await getAllColors();
      const allSizes = await getAllSizes();
      setAvailableCollections(allCollections);
      setAvailableColors(allColors);
      setAvailableSizes(allSizes);
    };

    getColorSizeCollection();
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

  const updateVariant = (id: string, field: string, value: string | number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.variant_id === id ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const addVariant = () => {
    const newId = v4();
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variant_id: newId,
          variant_code: "",
          product: {
            name: prev.name,
            product_id: prev.product_id,
            base_price: prev.base_price,
            sale_price: prev.sale_price,
          },
          color: {
            color_id: "",
            color_name: "",
            color_code: "",
          },
          size: { size_code: "", size_id: "" },
          quantity: 0,
          image: {
            image_id: "",
            image_url: "",
            image_name: "",
            created_at: new Date(),
            published_at: null,
            updated_at: new Date(),
          },
          created_at: new Date(),
          published_at: null,
          updated_at: new Date(),
        },
      ],
    }));
  };

  const removeVariant = (id: string) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.variant_id !== id),
    }));
  };

  const toggleCollection = async (collectionId: string) => {
    setCollectionSelectedIds((prev) => {
      if (prev.includes(collectionId)) {
        return [...prev.filter((id) => id === collectionId)];
      } else {
        return [...prev, collectionId];
      }
    });
  };

  // New method to handle opening the image selector
  const openImageSelector = () => {
    setIsImageSelectorOpen(true);
  };

  // Method to handle selecting an image from the gallery
  const handleProductImageSelect = (image: ImageType) => {
    setProduct((prev) => ({
      ...prev,
      images: [...prev.variant_images, image],
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
          images: [...prev.variant_images, ...newImages],
        }));
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  };

  const removeImage = (imageId: string) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.variant_images.filter((img) => img.image_id !== imageId),
    }));
  };

  // Method to open variant image selector
  const openVariantImageSelector = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setIsVariantImageSelectorOpen(true);
  };

  // Method to handle variant image selection from gallery
  const handleVariantImageSelect = (image: ImageType) => {
    if (selectedVariant !== null) {
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.map((variant) =>
          variant.variant_id === selectedVariant.variant_id
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
      [key: string]: { color?: string; size?: string; quantity?: string };
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
        variantErrors[variant.variant_id] = variantError;
      }
    });

    if (hasVariantErrors) {
      newErrors.variants = variantErrors;
    }

    setErrors(
      newErrors as FormErrors & {
        variants?: {
          [key: string]: { color?: string; size?: string; quantity?: string };
        };
      }
    );
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (publish = false) => {
    if (!validateForm()) {
      notification.error({
        message: isEditMode
          ? "Cập nhật không thành công!"
          : "Xuất bản không thành công",
      });
      return;
    }

    notification.success({
      message: isEditMode ? "Cập nhật thành công!" : "Xuất bản thành công",
    });

    setIsSaving(true);

    // Update published status if needed
    if (publish && !product.published_at) {
      setProduct((prev) => ({ ...prev, published_at: new Date() }));
    }

    // In a real app, you would send the data to your API
    setTimeout(() => {
      setIsSaving(false);
      addProductWithDetails(
        { ...product, sale_price: product.sale_price ?? undefined },
        product.variant_images,
        collectionSelectedIds,
        product.outfits.map((outfit) => outfit.outfit_id),
        variants
      );
      navigate("/admin/products");
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
              to="/admin/products"
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

              {product.variant_images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {product.variant_images.map((image) => (
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
                  key={variant.variant_id}
                  className="p-4 border border-gray-200 rounded-md mb-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Biến thể {index + 1}</h3>
                    {product.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.variant_id)}
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
                        value={variant.color.color_id}
                        onChange={(e) =>
                          updateVariant(
                            variant.variant_id,
                            "color",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.variant_id]?.color ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      >
                        <option value="">Chọn màu</option>
                        {availableColors.map((color) => (
                          <option key={color.color_id} value={color.color_id}>
                            {color.color_name}
                          </option>
                        ))}
                      </select>
                      {errors.variants?.[variant.variant_id]?.color && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants[variant.variant_id].color}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kích cỡ <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={variant.size.size_id}
                        onChange={(e) =>
                          updateVariant(
                            variant.variant_id,
                            "size",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.variant_id]?.size ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      >
                        <option value="">Chọn kích cỡ</option>
                        {availableSizes.map((size) => (
                          <option key={size.size_id} value={size.size_id}>
                            {size.size_code}
                          </option>
                        ))}
                      </select>
                      {errors.variants?.[variant.variant_id]?.size && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants[variant.variant_id].size}
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
                            variant.variant_id,
                            "quantity",
                            Number.parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.variant_id]?.quantity ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                        placeholder="50"
                        min="0"
                      />
                      {errors.variants?.[variant.variant_id]?.quantity && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants[variant.variant_id].quantity}
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
                          onClick={() => openVariantImageSelector(variant)}
                        >
                          <img
                            src={variant.image.image_url || "/placeholder.svg"}
                            alt={`${getColorName(variant.color.color_name)} ${getSizeName(variant.size.size_code)}`}
                            className="w-full h-full object-cover rounded-md border border-gray-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                            <p className="text-white text-xs">Thay đổi</p>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openVariantImageSelector(variant)}
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
                    key={collection.collection_id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-600"
                      checked={collectionSelectedIds.includes(
                        collection.collection_id
                      )}
                      onChange={() =>
                        toggleCollection(collection.collection_id)
                      }
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
                      key={variant.variant_id}
                      className="p-3 border border-gray-200 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {getColorName(variant.color.color_name)} /{" "}
                            {getSizeName(variant.size.size_code)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {variant.quantity}
                          </p>
                        </div>
                        {variant.image && (
                          <img
                            src={variant.image.image_url || "/placeholder.svg"}
                            alt={`${getColorName(variant.color.color_name)} ${getSizeName(variant.size.size_code)}`}
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
            selectedImages={product.variant_images}
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
              product.variants.find(
                (v) => v.variant_id === selectedVariant.variant_id
              )?.image
                ? [
                    product.variants.find(
                      (v) => v.variant_id === selectedVariant.variant_id
                    )!.image!,
                  ]
                : []
            }
            title={`Chọn hình ảnh cho biến thể ${
              product.variants.find(
                (v) => v.variant_id === selectedVariant.variant_id
              )?.color &&
              getColorName(
                product.variants.find(
                  (v) => v.variant_id === selectedVariant.variant_id
                )?.color.color_name || ""
              )
            } / ${
              product.variants.find(
                (v) => v.variant_id === selectedVariant.variant_id
              )?.size.size_code &&
              getSizeName(
                product.variants.find(
                  (v) => v.variant_id === selectedVariant.variant_id
                )?.size.size_code || ""
              )
            }`}
            multiple={false}
          />
        )}
      </div>
    </div>
  );
}
