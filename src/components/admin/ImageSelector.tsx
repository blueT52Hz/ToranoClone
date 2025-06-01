import React, { useState, useEffect } from "react";
import { Image } from "@/types/image.type";
import { Upload, X, ArrowDown, ArrowUp, Search } from "lucide-react";
import { imageApi } from "@/apis/admin/image.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Pagination from "@/components/common/Pagination";
import { notification } from "antd";
import { AxiosError } from "axios";
interface ImageSelectorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedImages?: Image[];
  title?: string;
  onImageSelect: (image: Image | Image[]) => void;
  isAllowMultiple?: boolean;
}

type SortBy = "image_name" | "created_at" | "updated_at";

const ImageSelector: React.FC<ImageSelectorProps> = ({
  onImageSelect,
  isOpen,
  setIsOpen,
  selectedImages = [],
  title = "Chọn hình ảnh",
  isAllowMultiple = false,
}) => {
  const [view, setView] = useState<"gallery" | "upload">("gallery");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const uploadImageMutation = useMutation({
    mutationFn: (formData: FormData) => imageApi.createImage(formData),
    onSuccess: (data) => {
      notification.success({
        message: `Tải lên hình ảnh thành công ${data.data.data.length} ảnh`,
      });
      const imagesSelect = isAllowMultiple ? data.data.data : data.data.data[0];
      onImageSelect(imagesSelect);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Tải lên hình ảnh thất bại",
        description: error.response?.data.message,
      });
    },
  });

  const { data: imagesData } = useQuery({
    queryKey: ["images", currentPage, searchTerm, sortBy, sortOrder],
    queryFn: () =>
      imageApi.getImages(currentPage, 8, searchTerm, sortBy, sortOrder),
  });

  useEffect(() => {
    if (imagesData) {
      setGalleryImages(imagesData.data.data.images);
      setTotalPages(imagesData.data.data.pagination.totalPages);
    }
  }, [imagesData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }
      uploadImageMutation.mutate(formData);
    }
  };

  const isImageSelected = (imageId: string) => {
    return selectedImages.some((img) => img.image_id === imageId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            title="Hủy"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            title="Thư viện"
            className={`px-4 py-2 ${view === "gallery" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setView("gallery")}
          >
            Thư viện
          </button>
          <button
            title="Tải lên mới"
            className={`px-4 py-2 ${view === "upload" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setView("upload")}
          >
            Tải lên mới
          </button>
        </div>

        <div className="p-4">
          {view === "gallery" ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm hình ảnh..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 rounded-md border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    title="Sắp xếp"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="image_name">Tên hình ảnh</option>
                    <option value="created_at">Ngày tạo</option>
                    <option value="updated_at">Ngày cập nhật</option>
                  </select>
                  <button
                    title="Sắp xếp"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
                  >
                    {sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid max-h-96 grid-cols-3 gap-4 overflow-y-auto md:grid-cols-4">
                {galleryImages.map((image) => (
                  <div
                    key={image.image_id}
                    className={`relative cursor-pointer overflow-hidden rounded-md border ${isImageSelected(image.image_id) ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => onImageSelect(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.image_name}
                      className="h-32 w-full object-cover"
                    />
                    <div className="truncate border-t bg-gray-50 p-1 text-xs text-gray-500">
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

              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <input
                type="file"
                id="new-image-upload"
                accept="image/*"
                multiple={isAllowMultiple}
                className="hidden"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="new-image-upload"
                className="flex cursor-pointer flex-col items-center justify-center"
              >
                {uploadImageMutation.isPending ? (
                  <div className="mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                ) : (
                  <Upload className="mb-2 h-8 w-8 text-gray-400" />
                )}
                <p className="mb-1 text-sm text-gray-600">
                  {uploadImageMutation.isPending
                    ? "Đang tải lên..."
                    : "Kéo thả hoặc click để tải lên hình ảnh"}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (Tối đa 5MB)</p>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
