import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Plus, Search, Trash2, Upload } from "lucide-react";
import { ProductImage } from "@/types/product";
import Pagination from "@/components/common/Pagination";
import {
  getGalleryImages,
  removeFromGallery,
  uploadImageToGallery,
} from "@/services/imageService";

export default function GalleryPage() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Sorting and pagination
  const [sortField, setSortField] = useState<keyof ProductImage>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const galleryImages = getGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: keyof ProductImage) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Filter and sort images
  const filteredImages = images
    .filter(
      (image) =>
        image.image_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.image_id.includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === "asc" ? -1 : 1;
      if (bValue === null) return sortDirection === "asc" ? 1 : -1;

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Delete image modal
  const openDeleteModal = (image: ProductImage) => {
    setSelectedImage(image);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedImage) {
      removeFromGallery(selectedImage.image_id);
      setImages(
        images.filter((image) => image.image_id !== selectedImage.image_id)
      );
      setIsDeleteModalOpen(false);
      setSelectedImage(null);
    }
  };

  // File upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...fileArray]);

      // Create preview URLs
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setSelectedImages([...selectedImages, ...imageUrls]);
    }
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newImages = [...selectedImages];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      // Upload each file and add to gallery
      const uploadPromises = selectedFiles.map((file) =>
        uploadImageToGallery(file)
      );
      const newImages = await Promise.all(uploadPromises);

      setImages([...newImages, ...images]);
      setSelectedFiles([]);
      setSelectedImages([]);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // Render sort arrow
  const renderSortArrow = (field: keyof ProductImage) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ArrowUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="inline h-4 w-4 ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Thư viện ảnh</h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tải lên ảnh mới
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Tìm kiếm ảnh..."
                className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600">
                Sắp xếp theo:
              </label>
              <select
                id="sortBy"
                className="py-2 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={sortField}
                onChange={(e) =>
                  handleSort(e.target.value as keyof ProductImage)
                }
              >
                <option value="created_at">Ngày tạo</option>
                <option value="image_name">Tên ảnh</option>
                <option value="published_at">Trạng thái xuất bản</option>
              </select>

              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100"
              >
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {currentImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentImages.map((image) => (
                <div key={image.image_id} className="group relative">
                  <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.image_name}
                      className="w-full h-full object-cover"
                    />
                    {image.published_at === null && (
                      <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Bản nháp
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <button
                      onClick={() => openDeleteModal(image)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div
                    className="mt-2 text-sm text-gray-500 truncate"
                    title={image.image_name}
                  >
                    {image.image_name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy ảnh nào</p>
            </div>
          )}

          {filteredImages.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tải lên ảnh mới
              </h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Kéo thả hoặc click để tải lên hình ảnh
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG (Tối đa 5MB mỗi ảnh)
                    </p>
                  </label>
                </div>

                {selectedImages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Đã chọn {selectedImages.length} ảnh:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFiles([]);
                    setSelectedImages([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={selectedFiles.length === 0}
                >
                  Tải lên
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa ảnh "{selectedImage?.image_name}"
                không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
