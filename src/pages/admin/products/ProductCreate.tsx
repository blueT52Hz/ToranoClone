import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { CategoryProduct } from "@/types/category.type";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/apis/admin/category.api";
import { Color } from "@/types/color.type";
import { colorApi } from "@/apis/admin/color.api";
import { Size } from "@/types/size.type";
import { Image } from "@/types/image.type";
import { sizeApi } from "@/apis/admin/size.api";
import ImageSelector from "@/components/admin/ImageSelector";
import SelectedImage from "@/components/admin/SelectedImage";

export default function ProductCreate() {
  const [categories, setCategories] = useState<CategoryProduct[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isOpenImageSelector, setIsOpenImageSelector] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [typeOfImage, setTypeOfImage] = useState<
    "thumbnail" | "hover" | "normal"
  >("normal");
  const [selectedThumbnailImage, setSelectedThumbnailImage] =
    useState<Image | null>(null);
  const [selectedHoverImage, setSelectedHoverImage] = useState<Image | null>(
    null,
  );

  const { data: categoriesData } = useQuery({
    queryKey: ["categoriesForProduct"],
    queryFn: () => categoryApi.getCategoriesForProduct(),
  });

  const { data: colorsData } = useQuery({
    queryKey: ["colors"],
    queryFn: () => colorApi.getColors(),
  });

  const { data: sizesData } = useQuery({
    queryKey: ["sizes"],
    queryFn: () => sizeApi.getSizes(),
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.data.data);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (colorsData) {
      setColors(colorsData.data.data.colors);
    }
  }, [colorsData]);

  useEffect(() => {
    if (sizesData) {
      setSizes(sizesData.data.data.sizes);
    }
  }, [sizesData]);

  const handleImageSelect = (images: Image | Image[]) => {
    console.log("Selected images:", images);
    setIsOpenImageSelector(false);

    if (Array.isArray(images)) {
      // Nếu là mảng ảnh (cho thư viện ảnh)
      setSelectedImages(images);
    } else {
      // Nếu là ảnh đơn (cho thumbnail hoặc hover)
      switch (typeOfImage) {
        case "thumbnail":
          setSelectedThumbnailImage(images);
          break;
        case "hover":
          setSelectedHoverImage(images);
          break;
        default:
          // Nếu không phải thumbnail hay hover thì thêm vào thư viện ảnh
          setSelectedImages((prev) => [...prev, images]);
          break;
      }
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
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
              Thêm sản phẩm mới
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Lưu nháp
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Save className="mr-2 inline-block h-4 w-4" />
              Xuất bản
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Nhập slug sản phẩm"
                  />
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
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="TS001"
                    />
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
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Hình ảnh sản phẩm</h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                    onClick={() => {
                      setTypeOfImage("normal");
                      setIsOpenImageSelector(true);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Chọn ảnh
                  </button>
                </div>
              </div>

              <div className="mb-6 flex gap-20">
                <SelectedImage
                  image={selectedThumbnailImage}
                  title="Ảnh thumbnail"
                  onSelect={() => {
                    setTypeOfImage("thumbnail");
                    setIsOpenImageSelector(true);
                  }}
                  showImageName={true}
                  onRemove={() => setSelectedThumbnailImage(null)}
                />

                <SelectedImage
                  image={selectedHoverImage}
                  title="Ảnh hover"
                  onSelect={() => {
                    setTypeOfImage("hover");
                    setIsOpenImageSelector(true);
                  }}
                  showImageName={true}
                  onRemove={() => setSelectedHoverImage(null)}
                />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Thư viện ảnh
                </h3>
                {selectedImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {selectedImages.map((image) => (
                      <SelectedImage
                        key={image.image_id}
                        image={image}
                        title=""
                        size="md"
                        showImageName={true}
                        onSelect={() => {
                          setTypeOfImage("normal");
                          setIsOpenImageSelector(true);
                        }}
                        onRemove={() => {
                          setSelectedImages((prev) =>
                            prev.filter(
                              (img) => img.image_id !== image.image_id,
                            ),
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    <p className="text-sm text-gray-500">
                      Chưa có hình ảnh nào được thêm vào. Vui lòng chọn ảnh từ
                      thư viện.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="299000"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sale_price"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Giá bán (VND)
                  </label>
                  <input
                    type="number"
                    id="sale_price"
                    name="sale_price"
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
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Biến thể sản phẩm</h2>
                <button
                  type="button"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm biến thể
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Collections */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Danh mục sản phẩm</h2>
              <div className="space-y-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category.category_id}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        id={`category-${category.category_id}`}
                        name="categories"
                        value={category.category_id}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      />
                      <label
                        htmlFor={`category-${category.category_id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.category_name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Chưa có danh mục nào</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageSelector
        isOpen={isOpenImageSelector}
        setIsOpen={setIsOpenImageSelector}
        isAllowMultiple={typeOfImage === "normal"}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
}
