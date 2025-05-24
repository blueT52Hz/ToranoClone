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
} from "@/types/product.type";
import { uploadImageToGallery } from "@/services/admin/gallery";
import ImageSelector from "@/components/admin/ImageSelector";
import { getProductById } from "@/services/admin/product";
import { getAllCollections } from "@/services/admin/collection";
import { v4 } from "uuid";
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

  // ====================PRODUCT FORM========================
  const [productForm, setProductForm] = useState<{
    name: string;
    product_code: string;
    slug: string;
    brand_name?: string;
    description?: string;
    base_price: number;
    sale_price?: number;
    discount?: number;
  }>({
    name: "",
    product_code: "",
    base_price: 0,
    slug: "",
  });

  const [basicInfoFormErrors, setBasicInfoFormErrors] = useState<{
    name?: string;
    slug?: string;
    product_code?: string;
    base_price?: string;
  }>({});
  // Hàm xử lý thay đổi input
  const handleProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Cập nhật giá trị form
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xử lý validation
    if (name === "name" && value.trim() === "") {
      setBasicInfoFormErrors((prev) => ({
        ...prev,
        name: "Tên sản phẩm không được để trống",
      }));
    } else if (name === "product_code" && value.trim() === "") {
      setBasicInfoFormErrors((prev) => ({
        ...prev,
        product_code: "Mã sản phẩm không được để trống",
      }));
    } else if (name === "base_price" && Number(value) <= 0) {
      setBasicInfoFormErrors((prev) => ({
        ...prev,
        base_price: "",
      }));
    } else {
      setBasicInfoFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "discount") {
      const discount = parseFloat((productForm.discount ?? "").toString());
      if (discount > 100) {
        setBasicInfoFormErrors((prev) => ({
          ...prev,
          discount: "Discount không được vượt quá 100%",
        }));
      }
    }

    // Tính toán discount nếu thay đổi base_price hoặc sale_price
    if (name === "base_price" || name === "sale_price") {
      const base = parseFloat(productForm.base_price.toString());
      const sale = parseFloat((productForm.sale_price ?? 0).toString());
      if (sale > base) {
        setBasicInfoFormErrors((prev) => ({
          ...prev,
          sale_price: "Giá khuyến mãi không được cao hơn giá gốc",
        }));
      }
    }
  };

  const validateProductForm = () => {
    if (!productForm.name.trim()) {
      setBasicInfoFormErrors({
        ...basicInfoFormErrors,
        name: "Tên sản phẩm không được để trống",
      });
    }

    if (!productForm.slug.trim()) {
      setBasicInfoFormErrors({
        ...basicInfoFormErrors,
        slug: "Slug được để trống",
      });
    }

    if (!productForm.product_code.trim()) {
      setBasicInfoFormErrors({
        ...basicInfoFormErrors,
        product_code: "Mã sản phẩm không được để trống",
      });
    }

    if (productForm.base_price <= 0) {
      setBasicInfoFormErrors({
        ...basicInfoFormErrors,
        base_price: "Giá gốc phải lớn hơn 0",
      });
    }

    // Trả về true nếu không có lỗi, ngược lại trả về false
    return !Object.values(errors).some((error) => error !== "");
  };
  // ============================================

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
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // danh sách collection chọn
  const [collectionSelectedIds, setCollectionSelectedIds] = useState<string[]>(
    [],
  );

  // danh sách tất cả collection
  const [availableCollections, setAvailableCollections] = useState<
    Collection[]
  >([]);

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
    >,
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
                  ((prev.base_price - numValue) / prev.base_price) * 100,
                )
              : prev.discount,
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
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
      },
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
      // addProductWithDetails(
      //   { ...product, sale_price: product.sale_price ?? undefined },
      //   product.variant_images,
      //   collectionSelectedIds,
      //   product.outfits.map((outfit) => outfit.outfit_id),
      //   variants
      // );
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
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/products"
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
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
                className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                <Trash2 className="mr-2 inline-block h-4 w-4" />
                Xóa
              </button>
            )}
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSaving}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Lưu nháp
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSaving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 inline-block h-4 w-4" />
                  {isEditMode ? "Cập nhật" : "Xuất bản"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <BasicInfo
              basicInfoFormErrors={basicInfoFormErrors}
              handleProductInputChange={handleProductInputChange}
              productForm={productForm}
            />

            {/* Images */}
            <ProductImages product={product} setProduct={setProduct} />

            {/* Pricing */}

            {/* Variants */}
            <ProductVariants
              availableColors={availableColors}
              errors={errors}
              getColorName={getColorName}
              getSizeName={getSizeName}
              availableSizes={availableSizes}
              product={product}
              setProduct={setProduct}
            />
          </div>

          <div className="space-y-6">
            {/* Publishing */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Xuất bản</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={product.published_at !== null}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          published_at: e.target.checked ? new Date() : null,
                        }))
                      }
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {product.published_at !== null
                        ? "Đã xuất bản"
                        : "Bản nháp"}
                    </span>
                  </label>
                </div>

                {isEditMode && (
                  <div>
                    <p className="mb-2 text-sm text-gray-500">
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
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Bộ sưu tập</h2>
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
                        collection.collection_id,
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
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Xác nhận xóa
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa sản phẩm "{product.name}" không? Hành
                động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BasicInfoProps {
  basicInfoFormErrors: {
    name?: string;
    slug?: string;
    product_code?: string;
    base_price?: string;
  };
  handleProductInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  productForm: {
    name: string;
    product_code: string;
    slug: string;
    brand_name?: string;
    description?: string;
    base_price: number;
    sale_price?: number;
    discount?: number;
  };
}

const BasicInfo = ({
  basicInfoFormErrors,
  handleProductInputChange,
  productForm,
}: BasicInfoProps) => {
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productForm.name}
              onChange={handleProductInputChange}
              className={`w-full border px-3 py-2 ${basicInfoFormErrors.name ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
              placeholder="Nhập tên sản phẩm"
            />
            {basicInfoFormErrors.name && (
              <p className="mt-1 text-sm text-red-500">
                {basicInfoFormErrors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product_code"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Mã sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="product_code"
                name="product_code"
                value={productForm.product_code}
                onChange={handleProductInputChange}
                className={`w-full border px-3 py-2 ${basicInfoFormErrors.product_code ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="TS001"
              />
              {basicInfoFormErrors.product_code && (
                <p className="mt-1 text-sm text-red-500">
                  {basicInfoFormErrors.product_code}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="brand_name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Thương hiệu
              </label>
              <input
                type="text"
                id="brand_name"
                name="brand_name"
                value={productForm.brand_name}
                onChange={handleProductInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Torano"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mô tả sản phẩm
            </label>
            <textarea
              id="description"
              name="description"
              value={productForm.description}
              onChange={handleProductInputChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập mô tả chi tiết về sản phẩm"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Giá sản phẩm</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="base_price"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Giá gốc (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="base_price"
              name="base_price"
              value={productForm.base_price || ""}
              onChange={handleProductInputChange}
              className={`w-full border px-3 py-2 ${basicInfoFormErrors.base_price ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
              placeholder="299000"
            />
            {basicInfoFormErrors.base_price && (
              <p className="mt-1 text-sm text-red-500">
                {basicInfoFormErrors.base_price}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="sale_price"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Giá khuyến mãi (VND)
            </label>
            <input
              type="number"
              id="sale_price"
              name="sale_price"
              value={productForm.sale_price || ""}
              onChange={handleProductInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="249000"
            />
          </div>
          <div>
            <label
              htmlFor="discount"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Giảm giá (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={productForm.discount}
              onChange={handleProductInputChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
            />
          </div>
        </div>
      </div>
    </>
  );
};

interface VariantSumaryProps {
  variants: ProductVariant[];
  getColorName: (colorId: string) => string;
  getSizeName: (sizeId: string) => string;
}

const VariantSummary = ({
  variants,
  getColorName,
  getSizeName,
}: VariantSumaryProps) => {
  if (variants.length === 0) return null; // Nếu không có variants thì không render gì cả.

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Tóm tắt biến thể</h2>
      <div className="space-y-3">
        {variants.map((variant) => (
          <div
            key={variant.variant_id}
            className="rounded-md border border-gray-200 p-3"
          >
            <div className="flex items-start justify-between">
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
                  className="h-10 w-10 rounded-md object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ProductImagesProps {
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  product: Product;
}

const ProductImages = ({ setProduct, product }: ProductImagesProps) => {
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const handleProductImageSelect = (image: ImageType) => {
    setProduct((prev) => ({
      ...prev,
      images: [...prev.variant_images, image],
    }));

    // Close the selector after selection
    setIsImageSelectorOpen(false);
  };
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

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Hình ảnh sản phẩm</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsImageSelectorOpen(true)}
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            <Plus className="mr-1 h-4 w-4" />
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
              className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="mr-1 h-4 w-4" />
              Tải lên
            </label>
          </div>
        </div>
      </div>

      {product.variant_images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {product.variant_images.map((image) => (
            <div key={image.image_id} className="group relative">
              <img
                src={image.image_url || "/placeholder.svg"}
                alt={image.image_name}
                className="h-24 w-full rounded-md border border-gray-200 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.image_id)}
                className="absolute right-1 top-1 rounded-full bg-white p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
              <div
                className="mt-1 truncate text-xs text-gray-500"
                title={image.image_name}
              >
                {image.image_name}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-500">
            Chưa có hình ảnh nào được thêm vào. Vui lòng chọn ảnh từ thư viện
            hoặc tải lên ảnh mới.
          </p>
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
    </div>
  );
};

interface ProductVariantsProps {
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  product: Product;
  errors: FormErrors & {
    variants?: {
      [key: string]: {
        color?: string;
        size?: string;
        quantity?: string;
      };
    };
  };
  availableColors: Color[];
  availableSizes: Size[];
  getColorName: (colorId: string) => string;
  getSizeName: (sizeId: string) => string;
}

const ProductVariants = ({
  errors,
  setProduct,
  product,
  availableColors,
  availableSizes,
  getColorName,
  getSizeName,
}: ProductVariantsProps) => {
  const [isVariantImageSelectorOpen, setIsVariantImageSelectorOpen] =
    useState(false);

  const openVariantImageSelector = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setIsVariantImageSelectorOpen(true);
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

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

  const handleVariantImageSelect = (image: ImageType) => {
    if (selectedVariant !== null) {
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.map((variant) =>
          variant.variant_id === selectedVariant.variant_id
            ? { ...variant, image: image }
            : variant,
        ),
      }));
    }

    setIsVariantImageSelectorOpen(false);
  };

  const removeVariant = (id: string) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.variant_id !== id),
    }));
  };

  const updateVariant = (id: string, field: string, value: string | number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.variant_id === id ? { ...variant, [field]: value } : variant,
      ),
    }));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Biến thể sản phẩm</h2>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm biến thể
        </button>
      </div>

      {product.variants.map((variant, index) => (
        <div
          key={variant.variant_id}
          className="mb-4 rounded-md border border-gray-200 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">Biến thể {index + 1}</h3>
            {product.variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(variant.variant_id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Màu sắc <span className="text-red-500">*</span>
              </label>
              <select
                value={variant.color.color_id}
                onChange={(e) =>
                  updateVariant(variant.variant_id, "color", e.target.value)
                }
                className={`w-full border px-3 py-2 ${errors.variants?.[variant.variant_id]?.color ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Kích cỡ <span className="text-red-500">*</span>
              </label>
              <select
                value={variant.size.size_id}
                onChange={(e) =>
                  updateVariant(variant.variant_id, "size", e.target.value)
                }
                className={`w-full border px-3 py-2 ${errors.variants?.[variant.variant_id]?.size ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={variant.quantity}
                onChange={(e) =>
                  updateVariant(
                    variant.variant_id,
                    "quantity",
                    Number.parseInt(e.target.value),
                  )
                }
                className={`w-full border px-3 py-2 ${errors.variants?.[variant.variant_id]?.quantity ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Hình ảnh biến thể
              </label>
              {variant.image ? (
                <div
                  className="group relative h-20 w-20 cursor-pointer"
                  onClick={() => openVariantImageSelector(variant)}
                >
                  <img
                    src={variant.image.image_url || "/placeholder.svg"}
                    alt={`${getColorName(variant.color.color_name)} ${getSizeName(variant.size.size_code)}`}
                    className="h-full w-full rounded-md border border-gray-300 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs text-white">Thay đổi</p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openVariantImageSelector(variant)}
                  className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 focus:outline-none"
                >
                  <Image className="h-8 w-8 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Variant Image Selector Modal */}
      {isVariantImageSelectorOpen && selectedVariant !== null && (
        <ImageSelector
          onImageSelect={handleVariantImageSelect}
          onCancel={() => setIsVariantImageSelectorOpen(false)}
          selectedImages={
            product.variants.find(
              (v) => v.variant_id === selectedVariant.variant_id,
            )?.image
              ? [
                  product.variants.find(
                    (v) => v.variant_id === selectedVariant.variant_id,
                  )!.image!,
                ]
              : []
          }
          title={`Chọn hình ảnh cho biến thể ${
            product.variants.find(
              (v) => v.variant_id === selectedVariant.variant_id,
            )?.color &&
            getColorName(
              product.variants.find(
                (v) => v.variant_id === selectedVariant.variant_id,
              )?.color.color_name || "",
            )
          } / ${
            product.variants.find(
              (v) => v.variant_id === selectedVariant.variant_id,
            )?.size.size_code &&
            getSizeName(
              product.variants.find(
                (v) => v.variant_id === selectedVariant.variant_id,
              )?.size.size_code || "",
            )
          }`}
          multiple={false}
        />
      )}
    </div>
  );
};
