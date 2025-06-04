import { CategoryFormData, CategoryDetail } from "@/types/category.type";
import { useEffect, useState } from "react";
import { Image } from "@/types/image.type";
import ImageSelector from "@/components/admin/ImageSelector";
import { UseFormSetValue } from "react-hook-form";

interface CategoryImageProps {
  category: CategoryDetail | null;
  setValue: UseFormSetValue<CategoryFormData>;
}

export const CategoryImage = ({ setValue, category }: CategoryImageProps) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);

  useEffect(() => {
    if (category) {
      setSelectedImage(category.image || null);
      if (category.image) {
        setValue("image_id", category.image.image_id);
      }
    }
  }, [category, setValue]);

  const handleImageSelect = (image: Image | Image[]) => {
    if (Array.isArray(image)) {
      setSelectedImage(image[0]);
      setValue("image_id", image[0].image_id);
    } else {
      setSelectedImage(image);
      setValue("image_id", image.image_id);
    }
    setShowImageSelector(false);
  };

  const handleOpenImageSelector = () => {
    setShowImageSelector(true);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Hình ảnh
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
        <div className="ml-4 flex flex-col gap-2">
          <button
            onClick={handleOpenImageSelector}
            className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
          >
            Chọn ảnh
          </button>
          {selectedImage && (
            <button
              onClick={() => {
                setSelectedImage(null);
                setValue("image_id", "");
              }}
              className="rounded bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200"
            >
              Xóa ảnh
            </button>
          )}
        </div>
      </div>
      {showImageSelector && (
        <ImageSelector
          onImageSelect={handleImageSelect}
          isOpen={showImageSelector}
          setIsOpen={setShowImageSelector}
          selectedImages={selectedImage ? [selectedImage] : []}
          title="Chọn hình ảnh cho danh mục"
        />
      )}
    </div>
  );
};
