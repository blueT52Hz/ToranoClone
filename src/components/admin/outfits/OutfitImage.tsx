import { OutfitFormData, OutfitDetail } from "@/types/outfit.type";
import { useEffect, useState } from "react";
import { Image } from "@/types/image.type";
import ImageSelector from "../ImageSelector";
import {
  FieldErrors,
  UseFormSetValue,
  UseFormSetError,
  UseFormRegister,
} from "react-hook-form";

interface OutfitImageProps {
  outfit: OutfitDetail | null;
  register: UseFormRegister<OutfitFormData>;
  setValue: UseFormSetValue<OutfitFormData>;
  setError: UseFormSetError<OutfitFormData>;
  errors: FieldErrors<OutfitFormData>;
}

export const OutfitImage = ({
  register,
  setValue,
  setError,
  errors,
  outfit,
}: OutfitImageProps) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);

  useEffect(() => {
    if (outfit) {
      setSelectedImage(outfit.image);
      setValue("image_id", outfit.image.image_id);
    }
  }, [outfit, setValue]);

  const handleImageSelect = (image: Image | Image[]) => {
    if (Array.isArray(image)) {
      setSelectedImage(image[0]);
      setValue("image_id", image[0].image_id);
      setError("image_id", { message: "" });
    } else {
      setSelectedImage(image);
      setValue("image_id", image.image_id);
      setError("image_id", { message: "" });
    }
    setShowImageSelector(false);
  };

  const handleOpenImageSelector = () => {
    if (!selectedImage) {
      setError("image_id", { message: "Vui lòng chọn hình ảnh cho outfit" });
    }
    setShowImageSelector(true);
  };

  return (
    <div
      {...register("image_id", {
        required: "Vui lòng chọn hình ảnh cho outfit",
        validate: () => {
          if (!selectedImage) {
            return "Vui lòng chọn hình ảnh cho outfit";
          }
          return true;
        },
      })}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Hình ảnh <span className="text-red-500">*</span>
      </label>
      <div className="flex items-start">
        <div
          className={`relative h-[200px] w-[150px] overflow-hidden rounded-md border border-gray-300`}
        >
          {selectedImage?.image_url ? (
            <img
              src={selectedImage.image_url}
              alt={selectedImage.image_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-400">Chưa có hình ảnh</span>
            </div>
          )}
        </div>
        <button
          onClick={handleOpenImageSelector}
          className="ml-4 rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
        >
          Chọn ảnh
        </button>
      </div>
      {errors.image_id && (
        <p className="mt-1 text-sm text-red-500">{errors.image_id.message}</p>
      )}
      {showImageSelector && (
        <ImageSelector
          onImageSelect={handleImageSelect}
          isOpen={showImageSelector}
          setIsOpen={setShowImageSelector}
          selectedImages={selectedImage ? [selectedImage] : []}
          title="Chọn hình ảnh cho outfit"
        />
      )}
    </div>
  );
};
