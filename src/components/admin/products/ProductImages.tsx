import { Plus } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";
import { ProductForm, ProductDetailAdmin } from "@/types/product.type";
import { Image } from "@/types/image.type";
import SelectedImage from "@/components/admin/SelectedImage";
import { useEffect, useState } from "react";
import ImageSelector from "../ImageSelector";

interface ProductImagesProps {
  product: ProductDetailAdmin | null;
  register: UseFormRegister<ProductForm>;
  errors: FieldErrors<ProductForm>;
  setValue: UseFormSetValue<ProductForm>;
  setError: UseFormSetError<ProductForm>;
  clearErrors: UseFormClearErrors<ProductForm>;
}

export const ProductImages = ({
  register,
  errors,
  setValue,
  setError,
  clearErrors,
  product,
}: ProductImagesProps) => {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [isOpenImageSelector, setIsOpenImageSelector] = useState(false);
  const [typeOfImage, setTypeOfImage] = useState<
    "thumbnail" | "hover" | "normal"
  >("normal");
  const [selectedThumbnailImage, setSelectedThumbnailImage] =
    useState<Image | null>(null);
  const [selectedHoverImage, setSelectedHoverImage] = useState<Image | null>(
    null,
  );
  useEffect(() => {
    if (product) {
      setSelectedThumbnailImage(product.thumbnail);
      setSelectedHoverImage(product.hover);
      setSelectedImages(product.images);
      setValue("thumbnail_id", product.thumbnail.image_id);
      setValue("hover_id", product.hover.image_id);
      setValue(
        "image_ids",
        product.images.map((img: Image) => img.image_id),
      );
    }
  }, [product, setValue]);

  const handleImageSelect = (images: Image | Image[]) => {
    setIsOpenImageSelector(false);

    if (Array.isArray(images)) {
      // Nếu là mảng ảnh (cho thư viện ảnh)
      setSelectedImages(images);
      setValue(
        "image_ids",
        images.map((img) => img.image_id),
      );
    } else {
      // Nếu là ảnh đơn (cho thumbnail hoặc hover)
      switch (typeOfImage) {
        case "thumbnail":
          // Kiểm tra nếu ảnh đã được chọn làm hover
          if (selectedHoverImage?.image_id === images.image_id) {
            setSelectedHoverImage(null);
            setValue("hover_id", "");
          }
          // Kiểm tra nếu ảnh đã có trong thư viện ảnh
          setSelectedImages((prev) =>
            prev.filter((img) => img.image_id !== images.image_id),
          );
          setSelectedThumbnailImage(images);
          setValue("thumbnail_id", images.image_id);
          clearErrors("thumbnail_id");
          break;
        case "hover":
          // Kiểm tra nếu ảnh đã được chọn làm thumbnail
          if (selectedThumbnailImage?.image_id === images.image_id) {
            setSelectedThumbnailImage(null);
            setValue("thumbnail_id", "");
          }
          // Kiểm tra nếu ảnh đã có trong thư viện ảnh
          setSelectedImages((prev) =>
            prev.filter((img) => img.image_id !== images.image_id),
          );
          setSelectedHoverImage(images);
          setValue("hover_id", images.image_id);
          clearErrors("hover_id");
          break;
        default:
          // Kiểm tra nếu ảnh đã được chọn làm thumbnail hoặc hover
          if (selectedThumbnailImage?.image_id === images.image_id) {
            setSelectedThumbnailImage(null);
            setValue("thumbnail_id", "");
          }
          if (selectedHoverImage?.image_id === images.image_id) {
            setSelectedHoverImage(null);
            setValue("hover_id", "");
          }
          // Thêm vào thư viện ảnh
          setSelectedImages((prev) => [...prev, images]);
          setValue(
            "image_ids",
            [...selectedImages, images].map((img) => img.image_id),
          );
          break;
      }
    }
  };
  return (
    <>
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
          <div
            {...register("thumbnail_id", {
              required: "Vui lòng chọn ảnh thumbnail",
              validate: () => {
                if (!selectedThumbnailImage) {
                  return "Vui lòng chọn ảnh thumbnail";
                }
                return true;
              },
            })}
          >
            <SelectedImage
              image={selectedThumbnailImage}
              title="Ảnh thumbnail"
              onSelect={() => {
                setTypeOfImage("thumbnail");
                setIsOpenImageSelector(true);
              }}
              showImageName={true}
              onRemove={() => {
                setSelectedThumbnailImage(null);
                setValue("thumbnail_id", "");
                setError("thumbnail_id", {
                  type: "manual",
                  message: "Vui lòng chọn ảnh thumbnail",
                });
              }}
            />
            {errors.thumbnail_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.thumbnail_id.message}
              </p>
            )}
          </div>

          <div
            {...register("hover_id", {
              required: "Vui lòng chọn ảnh hover",
              validate: () => {
                if (!selectedHoverImage) {
                  return "Vui lòng chọn ảnh hover";
                }
                return true;
              },
            })}
          >
            <SelectedImage
              image={selectedHoverImage}
              title="Ảnh hover"
              onSelect={() => {
                setTypeOfImage("hover");
                setIsOpenImageSelector(true);
              }}
              showImageName={true}
              onRemove={() => {
                setSelectedHoverImage(null);
                setValue("hover_id", "");
                setError("hover_id", {
                  type: "manual",
                  message: "Vui lòng chọn ảnh hover",
                });
              }}
            />
            {errors.hover_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.hover_id.message}
              </p>
            )}
          </div>
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
                      prev.filter((img) => img.image_id !== image.image_id),
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
        </div>
      </div>
      <ImageSelector
        isOpen={isOpenImageSelector}
        setIsOpen={setIsOpenImageSelector}
        isAllowMultiple={typeOfImage === "normal"}
        onImageSelect={handleImageSelect}
      />
    </>
  );
};
