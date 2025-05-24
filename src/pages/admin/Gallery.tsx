import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Search,
  Trash2,
  Upload,
  Pencil,
} from "lucide-react";
import { Image } from "@/types/image.type";
import Pagination from "@/components/common/Pagination";
import Modal from "@/components/admin/gallery/Modal";
import { notification } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { imageApi } from "@/apis/admin/image.api";
import { AxiosError } from "axios";

type SortBy = "image_name" | "created_at" | "updated_at";

export default function Gallery() {
  // State for images management
  const [images, setImages] = useState<Image[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sorting and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Modal controls
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const {
    data: imagesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["images"],
    queryFn: () =>
      imageApi.getImages(currentPage, 10, searchTerm, sortBy, sortOrder),
  });

  useEffect(() => {
    if (imagesData) {
      setImages(imagesData.data.data.images);
      setTotalPages(imagesData.data.data.pagination.totalPages);
      setCurrentPage(imagesData.data.data.pagination.page);
    }
  }, [imagesData]);

  useEffect(() => {
    setCurrentPage(1);
    refetch();
  }, [sortBy, sortOrder, searchTerm, refetch]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Edit image name
  const openEditModal = (image: Image) => {
    setIsEditModalOpen(true);
    setSelectedImage(image);
  };

  // Delete image
  const openDeleteModal = (image: Image) => {
    setIsDeleteModalOpen(true);
    setSelectedImage(image);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Thư viện ảnh</h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tải ảnh lên
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Tìm kiếm ảnh..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600">
                Sắp xếp theo:
              </label>
              <select
                id="sortBy"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
              >
                <option value="created_at">Ngày tạo</option>
                <option value="image_name">Tên ảnh</option>
                <option value="updated_at">Ngày cập nhật</option>
              </select>

              <button
                onClick={() => {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  setCurrentPage(1);
                }}
                className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600"
                aria-label={`Sắp xếp ${sortOrder === "asc" ? "giảm dần" : "tăng dần"}`}
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((image) => (
                <div
                  key={image.image_id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.image_alt}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-opacity group-hover:bg-opacity-30 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(image);
                          }}
                          className="rounded-full bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
                          aria-label="Sửa thông tin ảnh"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(image);
                          }}
                          className="rounded-full bg-white p-1.5 text-red-600 transition-colors hover:bg-red-50"
                          aria-label="Xóa ảnh"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div
                      className="truncate text-sm font-medium text-gray-700"
                      title={image.image_name}
                    >
                      {image.image_name}
                    </div>
                    <div
                      className="truncate text-xs text-gray-500"
                      title={image.image_alt}
                    >
                      {image.image_alt || "Không có mô tả"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(image.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">Không tìm thấy ảnh</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Xóa tìm kiếm
                </button>
              )}
            </div>
          )}

          {images.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      {/* Upload Modal */}
      <UploadImageModal
        isUploadModalOpen={isUploadModalOpen}
        setIsUploadModalOpen={setIsUploadModalOpen}
        onUploadSuccess={refetch}
      />

      {/* Edit Name Modal */}
      <EditNameImageModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        selectedImage={selectedImage}
        setImages={setImages}
        images={images}
        setSelectedImage={setSelectedImage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteImageModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onDeleteSuccess={refetch}
      />
    </div>
  );
}

interface UploadImageModalProps {
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUploadSuccess: () => void;
}

const UploadImageModal = ({
  isUploadModalOpen,
  setIsUploadModalOpen,
  onUploadSuccess,
}: UploadImageModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>(
    [],
  );
  // File upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...fileArray]);

      // Create preview URLs
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setSelectedImagePreviews([...selectedImagePreviews, ...imageUrls]);
    }
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...selectedImagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setSelectedImagePreviews(newPreviews);
  };

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      return imageApi.createImage(formData);
    },
    onSuccess: (data) => {
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setSelectedImagePreviews([]);
      onUploadSuccess();
      notification.success({
        message: `Tải ảnh lên thành công ${data.data.data.length} ảnh`,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error uploading images:", error);
      notification.error({
        message: "Lỗi tải ảnh lên",
        description: error.response?.data.message,
      });
    },
  });

  const handleUpload = async () => {
    uploadMutation.mutate(selectedFiles);
  };

  if (!isUploadModalOpen) return null;

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => {
        setIsUploadModalOpen(false);
        setSelectedFiles([]);
        setSelectedImagePreviews([]);
      }}
      title="Tải ảnh lên"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
          <label
            htmlFor="file-upload"
            className={`flex cursor-pointer flex-col items-center justify-center ${uploadMutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="mb-1 text-sm text-gray-600">
              Kéo thả hoặc nhấp để tải lên ảnh
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP</p>
          </label>
        </div>

        {selectedImagePreviews.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Đã chọn {selectedImagePreviews.length} ảnh:
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {selectedImagePreviews.map((preview, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-600">
                    {selectedFiles[index]?.name || `Ảnh ${index + 1}`}
                  </p>
                  {!uploadMutation.isPending && (
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white shadow-sm transition-colors hover:bg-red-700"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Modal */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => {
            setIsUploadModalOpen(false);
            setSelectedFiles([]);
            setSelectedImagePreviews([]);
          }}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          disabled={uploadMutation.isPending}
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          className={`flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 ${
            uploadMutation.isPending ? "cursor-not-allowed opacity-70" : ""
          }`}
          disabled={selectedFiles.length === 0 || uploadMutation.isPending}
        >
          {uploadMutation.isPending && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
        </button>
      </div>
    </Modal>
  );
};

interface EditNameImageModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImage: Image | null;
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  images: Image[];
  setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>;
}

const EditNameImageModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  images,
  setImages,
  selectedImage,
  setSelectedImage,
}: EditNameImageModalProps) => {
  const [newImageName, setNewImageName] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  useEffect(() => {
    if (selectedImage) {
      setNewImageName(selectedImage.image_name);
      setNewImageAlt(selectedImage.image_alt);
    }
  }, [selectedImage]);

  const updateMutation = useMutation({
    mutationFn: () =>
      imageApi.updateImage(selectedImage!.image_id, {
        image_name: newImageName.trim(),
        image_alt: newImageAlt.trim(),
      }),
    onSuccess: () => {
      setIsEditModalOpen(false);
      setSelectedImage(null);
      setImages(
        images.map((img) =>
          img.image_id === selectedImage!.image_id
            ? {
                ...img,
                image_name: newImageName.trim(),
                image_alt: newImageAlt.trim(),
              }
            : img,
        ),
      );
      notification.success({
        message: "Cập nhật thông tin ảnh thành công",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating image:", error);
      notification.error({
        message: "Lỗi sửa thông tin ảnh",
        description: error.response?.data.message,
      });
    },
  });

  const handleEditSave = async () => {
    if (!selectedImage || !newImageName.trim()) return;
    updateMutation.mutate();
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title="Sửa thông tin ảnh"
    >
      <div className="space-y-4">
        {selectedImage && (
          <div className="flex items-center justify-evenly">
            <div className="h-24 w-24 flex-shrink-0">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.image_name}
                className="h-full w-full rounded-md object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex-1">
                <label
                  htmlFor="imageName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Tên ảnh
                </label>
                <input
                  type="text"
                  id="imageName"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên ảnh"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="imageAlt"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Mô tả ảnh
                </label>
                <input
                  type="text"
                  id="imageAlt"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả ảnh"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleEditSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          disabled={!newImageName.trim()}
        >
          Lưu
        </button>
      </div>
    </Modal>
  );
};

interface DeleteImageModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImage: Image | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>;
  onDeleteSuccess: () => void;
}

const DeleteImageModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedImage,
  setSelectedImage,
  onDeleteSuccess,
}: DeleteImageModalProps) => {
  const deleteMutation = useMutation({
    mutationFn: () => imageApi.deleteImage(selectedImage!.image_id),
    onSuccess: () => {
      onDeleteSuccess();
      setIsDeleteModalOpen(false);
      setSelectedImage(null);
      notification.success({
        message: "Xóa ảnh thành công",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error deleting image:", error);
      notification.error({
        message: "Lỗi xóa ảnh",
        description: error.response?.data.message,
      });
    },
  });

  if (!selectedImage) return null;

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title="Xác nhận xóa"
    >
      <div className="space-y-4">
        {selectedImage && (
          <>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa ảnh "{selectedImage.image_name}"? Hành
              động này không thể hoàn tác.
            </p>
            <div className="mt-2 flex justify-center">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.image_name}
                className="h-40 rounded-md object-contain"
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
        >
          {deleteMutation.isPending ? (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Đang xóa...
            </>
          ) : (
            "Xóa"
          )}
        </button>
      </div>
    </Modal>
  );
};
