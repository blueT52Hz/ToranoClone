import { Color } from "@/types/color.type";
import { Size } from "@/types/size.type";
import { useEffect, useState } from "react";
import { VariantForm as VariantFormType } from "@/types/variant.type";
import { colorApi } from "@/apis/admin/color.api";
import { sizeApi } from "@/apis/admin/size.api";
import { useQuery } from "@tanstack/react-query";
import SelectedImage from "@/components/admin/SelectedImage";
import { Plus } from "lucide-react";
import VariantModal from "@/components/admin/variants/VariantModal";
import ImageSelector from "@/components/admin/ImageSelector";
import { Image } from "@/types/image.type";
import { UseFormSetValue } from "react-hook-form";
import { ProductForm } from "@/types/product.type";

interface VariantFormProps {
  variantsProp: VariantFormType[] | [];
  setValue: UseFormSetValue<ProductForm>;
}

export const VariantForm = ({ variantsProp, setValue }: VariantFormProps) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isOpenVariantModal, setIsOpenVariantModal] = useState(false);
  const [variants, setVariants] = useState<VariantFormType[]>([]);
  const [selectedVariant, setSelectedVariant] =
    useState<VariantFormType | null>(null);
  const [isOpenImageSelector, setIsOpenImageSelector] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const { data: colorsData } = useQuery({
    queryKey: ["colors"],
    queryFn: () => colorApi.getColors(),
  });

  const { data: sizesData } = useQuery({
    queryKey: ["sizes"],
    queryFn: () => sizeApi.getSizes(),
  });

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

  useEffect(() => {
    if (variantsProp) {
      setVariants(variantsProp);
    }
  }, [variantsProp]);

  const handleVariant = (data: VariantFormType) => {
    const existingVariantIndex = variants.findIndex(
      (v) => v.color_id === data.color_id && v.size_id === data.size_id,
    );

    let newVariants;
    if (existingVariantIndex !== -1) {
      newVariants = variants.map((v, index) =>
        index === existingVariantIndex ? data : v,
      );
    } else {
      // Nếu chưa tồn tại thì thêm mới
      newVariants = [...variants, data];
    }

    setVariants(newVariants);

    // Cập nhật giá trị form
    setValue(
      "variants",
      newVariants.map((v) => ({
        color_id: v.color_id,
        size_id: v.size_id,
        image_ids: v.images.map((i) => i.image_id),
        quantity: v.quantity,
        status: v.status,
      })),
    );

    setIsOpenVariantModal(false);
    setSelectedVariant(null);
  };

  const handleRemoveVariant = (variant: VariantFormType) => {
    setVariants((prev) =>
      prev.filter(
        (v) => v.color_id !== variant.color_id && v.size_id !== variant.size_id,
      ),
    );
  };

  const handleImageSelect = (images: Image | Image[]) => {
    setIsOpenImageSelector(false);
    if (!Array.isArray(images)) {
      setSelectedImages([...selectedImages, images]);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Biến thể sản phẩm</h2>
        <button
          type="button"
          onClick={() => setIsOpenVariantModal(true)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm biến thể
        </button>
      </div>

      {variants.length > 0 ? (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Biến thể #{index + 1}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVariant(variant);
                      setIsOpenVariantModal(true);
                    }}
                    className="rounded-md bg-blue-50 px-2 py-1 text-sm text-blue-600 hover:bg-blue-100"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(variant)}
                    className="rounded-md bg-red-50 px-2 py-1 text-sm text-red-600 hover:bg-red-100"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Màu sắc</p>
                  <p className="text-sm text-gray-500">
                    {
                      colors.find((c) => c.color_id === variant.color_id)
                        ?.color_name
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Kích thước
                  </p>
                  <p className="text-sm text-gray-500">
                    {
                      sizes.find((s) => s.size_id === variant.size_id)
                        ?.size_code
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Số lượng</p>
                  <p className="text-sm text-gray-500">{variant.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </p>
                  <p className="text-sm text-gray-500">
                    {variant.status === "published" ? "Xuất bản" : "Nháp"}
                  </p>
                </div>
              </div>

              {variant.images && variant.images.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Hình ảnh
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {variant.images.map((image) => (
                      <SelectedImage
                        key={image.image_id}
                        image={image}
                        title=""
                        size="sm"
                        showImageName={true}
                        onSelect={() => {}}
                        onRemove={() => {
                          setVariants((prev) =>
                            prev.map((v) =>
                              v.images.find(
                                (i) => i.image_id === image.image_id,
                              )
                                ? {
                                    ...v,
                                    images: v.images.filter(
                                      (i) => i.image_id !== image.image_id,
                                    ),
                                  }
                                : v,
                            ),
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-500">
            Chưa có biến thể nào được thêm vào. Vui lòng thêm biến thể cho sản
            phẩm.
          </p>
        </div>
      )}

      {isOpenVariantModal && (
        <VariantModal
          colors={colors}
          sizes={sizes}
          onSubmit={handleVariant}
          variant={selectedVariant}
          onClose={() => setIsOpenVariantModal(false)}
        />
      )}
      <ImageSelector
        isOpen={isOpenImageSelector}
        setIsOpen={setIsOpenImageSelector}
        isAllowMultiple={true}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};
