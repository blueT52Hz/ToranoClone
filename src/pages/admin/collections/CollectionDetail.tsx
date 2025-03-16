import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Collection, Image, Product } from "@/types/product";
import { ArrowLeft, Save, Plus, X, Search, Trash2, Upload } from "lucide-react";
import {
  addCollection,
  getCollectionById,
  updateCollection,
} from "@/services/admin/collection";
import ImageSelector from "@/components/admin/ImageSelector";
import { getProductsByCollectionId } from "@/services/admin/product";
import Loading from "@/components/common/Loading";
import { ProductSelectorModal } from "@/components/admin/products/ProductSelectorModal";
import { removeVietnameseTones } from "@/utils/utils";

interface collectionForm {
  name: string;
  slug: string;
  image?: Image;
}

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id ? true : false;

  const [collection, setCollection] = useState<Collection>({
    collection_id: "",
    name: "",
    slug: "",
    created_at: new Date(),
    published_at: null,
    updated_at: new Date(),
    image: {
      image_id: "",
      image_url: "",
      image_name: "",
      created_at: new Date(),
      published_at: new Date(),
      updated_at: new Date(),
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [imageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [collectionForm, setCollectionForm] = useState<collectionForm>({
    name: "",
    slug: "",
  });
  const handleImageSelect = (image: Image) => {
    setCollectionForm({ ...collectionForm, image: image });
    setIsImageSelectorOpen(false);
  };
  // Load collection data
  useEffect(() => {
    if (isEditMode && id) {
      const fetchCollection = async () => {
        setIsLoading(true);
        const result = await getCollectionById(id);
        const resultProduct = await getProductsByCollectionId(id);
        setCollection(result);
        setSelectedProducts(resultProduct);

        setCollectionForm({
          name: result.name,
          slug: result.slug,
          image: result.image,
        });
        setIsLoading(false);
      };
      fetchCollection();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = e.target;
    if (inputName === "name") {
      setCollectionForm({
        ...collectionForm,
        name: value,
        slug: removeVietnameseTones(value),
      });
    } else {
      setCollectionForm({
        ...collectionForm,
        slug: removeVietnameseTones(value),
      });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection({
      ...collection,
      published_at: e.target.checked ? new Date() : null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!collectionForm.name) {
      console.error("Vui lòng nhập tên bộ sưu tập");
      return;
    }

    console.log(!isEditMode);

    if (!isEditMode) {
      const result = await addCollection(
        {
          name: collectionForm.name,
          slug: collectionForm.slug,
          image_id: collectionForm.image?.image_id,
        },
        selectedProducts.map((product) => product.product_id)
      );
      console.log(result);
    } else {
      const result = await updateCollection(
        collection.collection_id,
        {
          name: collectionForm.name,
          slug: collectionForm.slug,
          image_id: collectionForm.image?.image_id,
        },
        selectedProducts.map((product) => product.product_id)
      );
      console.log(result);
    }

    console.log("Done");

    navigate("/admin/collections");
  };

  const handleSlugGeneration = () => {
    if (collection.name && !collection.slug) {
      setCollection({
        ...collection,
        slug: removeVietnameseTones(collection.name),
      });
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.product_id !== productId)
    );
    console.log(selectedProducts);
  };

  if (isLoading) return <Loading />;

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
                value={collectionForm.name}
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
                value={collectionForm.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="summer-collection"
              />
              <p className="text-xs text-gray-500 mt-1">
                Được sử dụng trên URL, để trống để tự động tạo.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Hình ảnh Collection</h2>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsImageSelectorOpen(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Chọn ảnh
                </button>

                {/* <div className="relative">
                  <input
                    type="file"
                    id="product-images"
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <label
                    htmlFor="product-images"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Tải lên
                  </label>
                </div> */}
              </div>
            </div>

            {collectionForm.image ? (
              <div className="grid grid-cols-4 gap-4">
                <div
                  key={collectionForm.image.image_id}
                  className="relative group"
                >
                  <img
                    src={collectionForm.image.image_url}
                    alt={collectionForm.image.image_name}
                    className="w-full h-auto object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCollectionForm({ ...collectionForm, image: undefined })
                    }
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                  <div
                    className="mt-1 text-xs text-gray-500 truncate"
                    title={collectionForm.image.image_name}
                  >
                    {collectionForm.image.image_name}
                  </div>
                </div>
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

          {imageSelectorOpen && (
            <ImageSelector
              onImageSelect={handleImageSelect}
              onCancel={() => setIsImageSelectorOpen(false)}
              selectedImages={
                collectionForm.image ? [collectionForm.image] : []
              }
              title="Chọn hình ảnh sản phẩm"
            />
          )}

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
        <ProductSelectorModal
          setIsProductSelectorOpen={setIsProductSelectorOpen}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}
    </div>
  );
}
