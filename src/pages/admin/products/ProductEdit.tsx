import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Upload, Plus, Image } from "lucide-react";
import { Color, FormErrors, Image as ImageType, Size } from "@/types/product";

interface Product {
  product_id: string;
  product_code: string;
  brand_name: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  sale_price: number | null;
  discount: number;
  created_at: Date;
  published_at: Date | null;
  updated_at: Date;
}

interface Variant {
  variant_id: string;
  color_id: string;
  size_id: string;
  product_id: string;
  image_id: string;
  quantity: number;
  variant_code: string;
}

interface Collection {
  collection_id: string;
  name: string;
}

import { uploadImageToGallery } from "@/services/admin/gallery";
import ImageSelector from "@/components/admin/ImageSelector";
import { v4 } from "uuid";
import { notification } from "antd";
import { supabase } from "@/services/supabaseClient";
import Loading from "@/components/common/Loading";
import { removeVietnameseTones } from "@/utils/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && id !== undefined;

  const [product, setProduct] = useState<Product>({
    product_id: v4(),
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
  });

  const [variants, setVariants] = useState<Variant[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionSelectedIds, setCollectionSelectedIds] = useState<string[]>(
    []
  );
  const [productImages, setProductImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getProduct = async () => {
      if (!id) return;
      const result = await supabase
        .from("product")
        .select("*")
        .eq("product_id", id)
        .single();
      if (result.data) {
        setProduct(result.data);
      } else {
        console.error("Error fetching product:", result.error);
      }
    };

    const getVariant = async () => {
      if (!id) return;
      const result = await supabase
        .from("product_variant")
        .select("*")
        .eq("product_id", id);
      console.log(result.data);
      if (result.data) {
        setVariants(result.data);
      } else {
        console.error("Error fetching product:", result.error);
      }
    };

    const getColors = async () => {
      const result = await supabase.from("color").select("*");
      if (result.data) {
        setColors(result.data);
      } else {
        console.error("Error fetching product:", result.error);
      }
    };

    const getSizes = async () => {
      const result = await supabase.from("size").select("*");
      if (result.data) {
        setSizes(result.data);
      } else {
        console.error("Error fetching product:", result.error);
      }
    };

    const getColelctions = async () => {
      const result = await supabase
        .from("collection")
        .select("collection_id, name");
      if (result.data) {
        setCollections(result.data);
      } else {
        console.error("Error fetching product:", result.error);
      }
    };

    const getCollectionSelectedIds = async () => {
      if (!id) return;
      const result = await supabase
        .from("product_collection")
        .select("collection_id")
        .eq("product_id", id);
      if (result.data) {
        setCollectionSelectedIds(result.data.map((item) => item.collection_id));
      } else {
        console.error("Error fetching collection ids:", result.error);
      }
    };

    const getProductImages = async () => {
      if (!id) return;
      const result = await supabase
        .from("product_image")
        .select("*")
        .eq("product_id", id);
      if (result.data) {
        console.log(result.data);
        setProductImages(result.data);
      } else {
        console.error("Error fetching collection ids:", result.error);
      }
    };

    getProduct();
    getSizes();
    getColors();
    getProductImages();
    getVariant();
    getColelctions();
    getCollectionSelectedIds();
    setIsLoading(false);
  }, []);

  if (isLoading) return <Loading />;

  const [errors, setErrors] = useState<
    FormErrors & {
      variants?: {
        [key: string]: { color?: string; size?: string; quantity?: string };
      };
    }
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // New state for image selectors
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [isVariantImageSelectorOpen, setIsVariantImageSelectorOpen] =
    useState(false);

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
    } else if (name === "name") {
      setProduct((prev) => ({
        ...prev,
        name: value,
        slug: removeVietnameseTones(value),
      }));
    } else if (name === "product_code") {
      setProduct((prev) => ({
        ...prev,
        product_code: value.toLocaleUpperCase(),
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateVariant = (id: string, field: string, value: string | number) => {
    setVariants((prev) => [
      ...prev.map((variant) =>
        variant.variant_id === id ? { ...variant, [field]: value } : variant
      ),
    ]);
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        variant_id: v4(),
        color_id: "",
        image_id: "",
        size_id: "",
        product_id: product.product_id,
        quantity: 0,
        variant_code: "",
      },
    ]);
  };

  const removeVariant = (id: string) => {
    // Tìm biến thể bị xóa
    const deletedVariant = variants.find((item) => item.variant_id === id);

    if (deletedVariant) {
      // Xóa biến thể khỏi danh sách variants
      setVariants((prev) => prev.filter((item) => item.variant_id !== id));

      // Kiểm tra xem có biến thể nào khác sử dụng ảnh này không
      const isImageUsed = variants.some(
        (item) =>
          item.variant_id !== id && item.image_id === deletedVariant.image_id
      );

      // Nếu không có biến thể nào khác sử dụng ảnh, xóa ảnh khỏi danh sách productImages
      if (!isImageUsed) {
        setProductImages((prev) =>
          prev.filter((item) => item.image_id !== deletedVariant.image_id)
        );
      }
    }
  };

  const toggleCollection = async (collectionId: string) => {
    setCollectionSelectedIds((prev) => {
      if (prev.includes(collectionId)) {
        return [...prev.filter((id) => id !== collectionId)];
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
    if (productImages.map((item) => item.image_id).includes(image.image_id)) {
      setProductImages((prev) =>
        prev.filter((item) => item.image_id !== image.image_id)
      );
    } else setProductImages((prev) => [...prev, image]);
    // Close the selector after selection
    setIsImageSelectorOpen(false);
  };

  // Method for direct image upload (legacy approach, can be removed if not needed)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map((file) => uploadImageToGallery(file));
      const newImages = await Promise.all(uploadPromises);
      setProductImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (imageId: string) => {
    setProductImages((prev) =>
      prev.filter((item) => item.image_id !== imageId)
    );
    setVariants((prev) =>
      prev.map((variant) =>
        variant.image_id === imageId ? { ...variant, image_id: "" } : variant
      )
    );
  };

  const [selectedVariant, setSelectedVariant] = useState<Variant>();

  // Method to open variant image selector
  const openVariantImageSelector = (variant: Variant) => {
    setSelectedVariant(variant);
    setIsVariantImageSelectorOpen(true);
  };

  // Method to handle variant image selection from gallery
  const handleVariantImageSelect = (image: ImageType) => {
    if (selectedVariant !== null) {
      //loại bỏ ảnh cũ của variant
      setProductImages((prev) => [
        ...prev.filter(
          (item) =>
            selectedVariant?.image_id !== item.image_id &&
            item.image_id !== image.image_id
        ),
        image,
      ]);

      setVariants((prev) =>
        prev.map((item) =>
          item.variant_id === selectedVariant?.variant_id
            ? { ...item, image_id: image.image_id }
            : item
        )
      );
    }

    setIsVariantImageSelectorOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate product name
    if (!product.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    if (!product.slug.trim()) {
      newErrors.slug = "Slug sản phẩm không được để trống";
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

    variants.forEach((variant) => {
      const variantError: { color?: string; size?: string; quantity?: string } =
        {};

      if (!variant.color_id) {
        variantError.color = "Vui lòng chọn màu sắc";
        hasVariantErrors = true;
      }

      if (!variant.size_id) {
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

  const handleSubmit = async (publish = false) => {
    if (!validateForm()) {
      notification.error({
        message: isEditMode
          ? "Cập nhật không thành công!"
          : "Xuất bản không thành công",
      });
      return;
    }

    setIsSaving(true);

    if (publish && !product.published_at) {
      setProduct((prev) => ({ ...prev, published_at: new Date() }));
    }

    const product_variant = variants.map((item) => ({
      ...item,
      variant_code:
        product.product_code +
        "_" +
        getColorCode(item.color_id) +
        "-" +
        getSizeName(item.size_id),
    }));

    if (isEditMode) {
      // Cập nhật thông tin sản phẩm
      setProduct((prev) => ({ ...prev, updated_at: new Date() }));
      const updateProduct = await supabase
        .from("product")
        .update(product)
        .eq("product_id", product.product_id)
        .select();

      if (updateProduct.error) {
        console.error("Lỗi khi cập nhật sản phẩm:", updateProduct.error);
        setIsSaving(false);
        return;
      }

      console.log("Cập nhật sản phẩm thành công:", updateProduct.data);

      // Xử lý ảnh trong chế độ chỉnh sửa
      const existingImages = await supabase
        .from("product_image")
        .select("*")
        .eq("product_id", product.product_id);

      if (existingImages.error) {
        console.error(
          "Lỗi khi lấy danh sách ảnh hiện có:",
          existingImages.error
        );
        setIsSaving(false);
        return;
      }

      const currentImageIds = existingImages.data.map((img) => img.image_id);
      const newImageIds = productImages.map((img) => img.image_id);

      // Xóa các ảnh không còn được sử dụng
      const imagesToDelete = currentImageIds.filter(
        (id) => !newImageIds.includes(id)
      );
      if (imagesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("product_image")
          .delete()
          .in("image_id", imagesToDelete);

        if (deleteError) {
          console.error("Lỗi khi xóa ảnh cũ:", deleteError);
        }
      }

      // Cập nhật hoặc thêm ảnh mới
      const updateImages = await Promise.all(
        productImages.map(async (item) => {
          if (item.image_id) {
            return await supabase
              .from("product_image")
              .update(item)
              .eq("image_id", item.image_id);
          } else {
            return await supabase
              .from("product_image")
              .insert({ ...item, product_id: product.product_id });
          }
        })
      );

      console.log("Cập nhật ảnh thành công:", updateImages);

      // Xử lý biến thể trong chế độ chỉnh sửa
      const existingVariants = await supabase
        .from("product_variant")
        .select("*")
        .eq("product_id", product.product_id);

      if (existingVariants.error) {
        console.error(
          "Lỗi khi lấy danh sách biến thể hiện có:",
          existingVariants.error
        );
        setIsSaving(false);
        return;
      }

      const currentVariantIds = existingVariants.data.map(
        (variant) => variant.variant_id
      );
      const newVariantIds = product_variant.map(
        (variant) => variant.variant_id
      );

      // Xóa các biến thể không còn được sử dụng
      const variantsToDelete = currentVariantIds.filter(
        (id) => !newVariantIds.includes(id)
      );
      if (variantsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("product_variant")
          .delete()
          .in("variant_id", variantsToDelete);

        if (deleteError) {
          console.error("Lỗi khi xóa biến thể cũ:", deleteError);
        }
      }

      // Cập nhật hoặc thêm biến thể mới
      const updateVariants = await Promise.all(
        product_variant.map(async (item) => {
          if (item.variant_id) {
            return await supabase
              .from("product_variant")
              .update(item)
              .eq("variant_id", item.variant_id);
          } else {
            return await supabase
              .from("product_variant")
              .insert({ ...item, product_id: product.product_id });
          }
        })
      );

      console.log("Cập nhật biến thể thành công:", updateVariants);

      // Xử lý bộ sưu tập trong chế độ chỉnh sửa
      const existingCollections = await supabase
        .from("product_collection")
        .select("*")
        .eq("product_id", product.product_id);

      if (existingCollections.error) {
        console.error(
          "Lỗi khi lấy danh sách bộ sưu tập hiện có:",
          existingCollections.error
        );
        setIsSaving(false);
        return;
      }

      const currentCollectionIds = existingCollections.data.map(
        (col) => col.collection_id
      );
      const newCollectionIds = collectionSelectedIds;

      // Xóa các bộ sưu tập không còn được sử dụng
      const collectionsToDelete = currentCollectionIds.filter(
        (id) => !newCollectionIds.includes(id)
      );
      if (collectionsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("product_collection")
          .delete()
          .in("collection_id", collectionsToDelete);

        if (deleteError) {
          console.error("Lỗi khi xóa bộ sưu tập cũ:", deleteError);
        }
      }

      // Thêm các bộ sưu tập mới
      const collectionsToAdd = newCollectionIds.filter(
        (id) => !currentCollectionIds.includes(id)
      );
      if (collectionsToAdd.length > 0) {
        const product_collection = collectionsToAdd.map((item) => ({
          collection_id: item,
          product_id: product.product_id,
        }));

        const { error: addError } = await supabase
          .from("product_collection")
          .insert(product_collection);

        if (addError) {
          console.error("Lỗi khi thêm bộ sưu tập mới:", addError);
        }
      }

      console.log("Cập nhật bộ sưu tập thành công");
    } else {
      setProduct((prev) => ({
        ...prev,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      const addProduct = await supabase
        .from("product")
        .insert({ ...product })
        .select();

      const product_collection = collectionSelectedIds.map((item) => ({
        collection_id: item,
        product_id: product.product_id,
      }));

      const addCollections = await supabase
        .from("product_collection")
        .insert(product_collection);

      const product_image = productImages.map((item) => ({
        ...item,
        product_id: product.product_id,
      }));

      const addImage = await Promise.all(
        product_image.map(
          async (item) =>
            await supabase
              .from("product_image")
              .update(item)
              .eq("image_id", item.image_id)
        )
      );

      const addVariant = await supabase
        .from("product_variant")
        .insert(product_variant);

      // console.log(addImage);
      // console.log(addProduct);
      // console.log(addCollections);
      // console.log(addVariant);
    }

    setIsSaving(false);

    navigate("/admin/products");
  };

  const handleDelete = async () => {
    // 1. Xóa các biến thể liên quan đến sản phẩm
    const { error: deleteVariantsError } = await supabase
      .from("product_variant")
      .delete()
      .eq("product_id", product.product_id);

    if (deleteVariantsError) {
      throw new Error(`Lỗi khi xóa biến thể: ${deleteVariantsError.message}`);
    }

    // 2. Đặt product_id của các ảnh liên quan về null (thay vì xóa)
    const { error: updateImagesError } = await supabase
      .from("product_image")
      .update({ product_id: null })
      .eq("product_id", product.product_id);

    if (updateImagesError) {
      throw new Error(`Lỗi khi cập nhật ảnh: ${updateImagesError.message}`);
    }

    // 3. Xóa các liên kết với bộ sưu tập
    const { error: deleteCollectionsError } = await supabase
      .from("product_collection")
      .delete()
      .eq("product_id", product.product_id);

    if (deleteCollectionsError) {
      throw new Error(
        `Lỗi khi xóa liên kết bộ sưu tập: ${deleteCollectionsError.message}`
      );
    }

    // 4. Xóa sản phẩm chính
    const { error: deleteProductError } = await supabase
      .from("product")
      .delete()
      .eq("product_id", product.product_id);

    if (deleteProductError) {
      throw new Error(`Lỗi khi xóa sản phẩm: ${deleteProductError.message}`);
    }

    // Thông báo thành công
    notification.success({
      message: "Xóa sản phẩm thành công!",
    });

    // Đóng modal xóa và chuyển hướng về trang danh sách sản phẩm
    setIsDeleteModalOpen(false);
    navigate("/admin/products");
  };

  const getColorName = (colorId: string) => {
    const color = colors.find((c) => c.color_id === colorId);
    return color ? color.color_name : "";
  };

  const getColorCode = (colorId: string) => {
    const color = colors.find((c) => c.color_id === colorId);
    return color ? color.color_code : "";
  };

  const getSizeName = (sizeId: string) => {
    const size = sizes.find((s) => s.size_id === sizeId);
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
              // onClick={() => handleSubmit(false)}
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

                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={product.slug}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.slug ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    placeholder="Nhập slug sản phẩm"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
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
                      placeholder="Torano"
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

              {productImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {productImages.map((image) => (
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

              {variants.map((variant, index) => (
                <div
                  key={variant.variant_id}
                  className="p-4 border border-gray-200 rounded-md mb-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Biến thể {index + 1}</h3>
                    {variants.length > 1 && (
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
                        value={variant.color_id}
                        onChange={(e) =>
                          updateVariant(
                            variant.variant_id,
                            "color_id",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.variant_id]?.color ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      >
                        <option value="">Chọn màu</option>
                        {colors.map((color) => (
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
                        value={variant.size_id}
                        onChange={(e) =>
                          updateVariant(
                            variant.variant_id,
                            "size_id",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border ${errors.variants?.[variant.variant_id]?.size ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      >
                        <option value="">Chọn kích cỡ</option>
                        {sizes.map((size) => (
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
                      {variant.image_id ? (
                        <div
                          className="relative group h-20 w-20 cursor-pointer"
                          onClick={() => openVariantImageSelector(variant)}
                        >
                          <img
                            src={
                              productImages.find(
                                (item) => item.image_id === variant.image_id
                              )?.image_url || "/placeholder.svg"
                            }
                            // alt={`${getColorName(variant.color_name)} ${getSizeName(variant.size_code)}`}
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
                      Ngày tạo:{" "}
                      {new Date(product.created_at).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cập nhật lần cuối:{" "}
                      {new Date(product.updated_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Collections */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Bộ sưu tập</h2>
              <div className="space-y-2">
                {collections.map((collection) => (
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
            {variants.length > 0 && (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Tóm tắt biến thể</h2>
                <div className="space-y-3">
                  {variants.map((variant) => (
                    <div
                      key={variant.variant_id}
                      className="p-3 border border-gray-200 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {getColorCode(variant.color_id)} /{" "}
                            {getSizeName(variant.size_id)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {variant.quantity}
                          </p>
                        </div>
                        {variant.image_id && (
                          <img
                            src={
                              productImages.find(
                                (image) => image.image_id === variant.image_id
                              )?.image_url || "/placeholder.svg"
                            }
                            alt={`${getColorName(variant.color_id)} ${getSizeName(variant.size_id)}`}
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
            selectedImages={productImages}
            title="Chọn hình ảnh sản phẩm"
            multiple={true}
          />
        )}

        {/* Variant Image Selector Modal */}
        {isVariantImageSelectorOpen && selectedVariant !== null && (
          <ImageSelector
            onImageSelect={handleVariantImageSelect}
            onCancel={() => setIsVariantImageSelectorOpen(false)}
            selectedImages={productImages}
            title={`Chọn hình ảnh cho biến thể`}
            multiple={false}
          />
        )}
      </div>
    </div>
  );
}
