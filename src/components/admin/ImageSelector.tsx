import React, { useState, useEffect } from "react";
import {
  getPaginatedGalleryImages,
  uploadImageToGallery,
} from "@/services/imageService";
import { ProductImage } from "@/types/product";
import { Upload, ArrowLeft, ArrowRight, X } from "lucide-react";

interface ImageSelectorProps {
  onImageSelect: (image: ProductImage) => void;
  onCancel: () => void;
  selectedImages?: ProductImage[];
  title?: string;
  multiple?: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  onImageSelect,
  onCancel,
  selectedImages = [],
  title = "Chọn hình ảnh",
  multiple = false,
}) => {
  const [view, setView] = useState<"gallery" | "upload">("gallery");
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    loadGalleryImages(currentPage);
  }, [currentPage]);

  const loadGalleryImages = (page: number) => {
    const { images, totalPages } = getPaginatedGalleryImages(page, pageSize);
    setGalleryImages(images);
    setTotalPages(totalPages);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const file = e.target.files[0];
        const newImage = await uploadImageToGallery(file);

        // Add the new image to the gallery and select it
        onImageSelect(newImage);

        // Reload first page to show the new image
        loadGalleryImages(1);
        setCurrentPage(1);

        // Switch back to gallery view
        setView("gallery");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const isImageSelected = (imageId: string) => {
    return selectedImages.some((img) => img.image_id === imageId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${view === "gallery" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setView("gallery")}
          >
            Thư viện
          </button>
          <button
            className={`px-4 py-2 ${view === "upload" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setView("upload")}
          >
            Tải lên mới
          </button>
        </div>

        <div className="p-4">
          {view === "gallery" ? (
            <>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {galleryImages.map((image) => (
                  <div
                    key={image.image_id}
                    className={`relative cursor-pointer border rounded-md overflow-hidden ${isImageSelected(image.image_id) ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => onImageSelect(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.image_name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-1 text-xs text-gray-500 truncate bg-gray-50 border-t">
                      {image.image_name}
                    </div>
                  </div>
                ))}

                {galleryImages.length === 0 && (
                  <div className="col-span-4 py-12 text-center text-gray-500">
                    Không có hình ảnh trong thư viện
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1 ? "text-gray-300" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${currentPage === totalPages ? "text-gray-300" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <input
                type="file"
                id="new-image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="new-image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                ) : (
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-600 mb-1">
                  {isUploading
                    ? "Đang tải lên..."
                    : "Kéo thả hoặc click để tải lên hình ảnh"}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (Tối đa 5MB)</p>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-2"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
