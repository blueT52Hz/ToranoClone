import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Color } from "@/types/color.type";
import { Size } from "@/types/size.type";
import { Image } from "@/types/image.type";
import ImageSelector from "@/components/admin/ImageSelector";
import SelectedImage from "@/components/admin/SelectedImage";
import { Plus, X } from "lucide-react";
import { VariantForm as VariantFormType } from "@/types/variant.type";

interface VariantFormProps {
  colors: Color[];
  sizes: Size[];
  variant: VariantFormType | null;
  onSubmit: (data: VariantFormType) => void;
  onClose: () => void;
}

export default function VariantModal({
  colors,
  sizes,
  variant,
  onSubmit,
  onClose,
}: VariantFormProps) {
  const [isOpenImageSelector, setIsOpenImageSelector] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VariantFormType>({
    defaultValues: {
      status: "draft",
      quantity: 0,
      ...variant,
    },
  });

  useEffect(() => {
    if (variant) {
      setSelectedImages(variant.images);
    }
  }, [variant]);

  const handleImageSelect = (images: Image | Image[]) => {
    setIsOpenImageSelector(false);
    if (!Array.isArray(images)) {
      const isImageExists = selectedImages.some(
        (img) => img.image_id === images.image_id,
      );

      if (!isImageExists) {
        const newImages = [...selectedImages, images];
        setSelectedImages(newImages);
        setValue("images", newImages);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {variant ? "Cập nhật" : "Thêm"} biến thể
          </h2>
          <button
            title="Close"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Màu sắc <span className="text-red-500">*</span>
              </label>
              <select
                {...register("color_id", { required: "Vui lòng chọn màu sắc" })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Chọn màu sắc</option>
                {colors.map((color) => (
                  <option key={color.color_id} value={color.color_id}>
                    {color.color_name}
                  </option>
                ))}
              </select>
              {errors.color_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.color_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Kích thước <span className="text-red-500">*</span>
              </label>
              <select
                {...register("size_id", {
                  required: "Vui lòng chọn kích thước",
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Chọn kích thước</option>
                {sizes.map((size) => (
                  <option key={size.size_id} value={size.size_id}>
                    {size.size_code}
                  </option>
                ))}
              </select>
              {errors.size_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.size_id.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("quantity", {
                required: "Vui lòng nhập số lượng",
                min: { value: 0, message: "Số lượng phải lớn hơn hoặc bằng 0" },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              {...register("status")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="draft">Nháp</option>
              <option value="published">Xuất bản</option>
            </select>
          </div>

          <div
            {...register("images", {
              required: "Mỗi biến thể phải có ít nhất 1 hình ảnh",
              validate: () => {
                if (selectedImages.length === 0) {
                  return "Mỗi biến thể phải có ít nhất 1 hình ảnh";
                }
                return true;
              },
            })}
          >
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Hình ảnh <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsOpenImageSelector(true)}
                className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                <Plus className="mr-1 h-4 w-4" />
                Chọn ảnh
              </button>
            </div>

            {selectedImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {selectedImages.map((image) => (
                  <SelectedImage
                    key={image.image_id}
                    image={image}
                    title=""
                    size="sm"
                    showImageName={true}
                    onSelect={() => setIsOpenImageSelector(true)}
                    onRemove={() => {
                      setSelectedImages((prev) =>
                        prev.filter((img) => img.image_id !== image.image_id),
                      );
                      setValue(
                        "images",
                        selectedImages.filter(
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
                  Chưa có hình ảnh nào được thêm vào. Vui lòng chọn ảnh từ thư
                  viện.
                </p>
              </div>
            )}
            <p className="mt-1 text-sm text-red-500">
              {errors.images?.message}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {variant ? "Cập nhật" : "Thêm biến thể"}
            </button>
          </div>
        </form>

        <ImageSelector
          isOpen={isOpenImageSelector}
          setIsOpen={setIsOpenImageSelector}
          isAllowMultiple={false}
          onImageSelect={handleImageSelect}
        />
      </div>
    </div>
  );
}
