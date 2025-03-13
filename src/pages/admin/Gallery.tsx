import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Search,
  Trash2,
  Upload,
  Pencil,
} from "lucide-react";
import { Image } from "@/types/product";
import Pagination from "@/components/common/Pagination";
import Modal from "@/components/admin/gallery/Modal";
import {
  getGalleryImages,
  removeFromGallery,
  uploadImageToGallery,
  updateImageName,
} from "@/services/admin/gallery";
import { notification } from "antd";

export default function Gallery() {
  // State for images management
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal controls
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [newImageName, setNewImageName] = useState("");

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>(
    []
  );
  const [uploadInProgress, setUploadInProgress] = useState(false);

  // Sorting and pagination
  const [sortField, setSortField] = useState<keyof Image>("created_at");
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
      const galleryImages = await getGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Image) => {
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

  // Edit image name
  const openEditModal = (image: Image) => {
    setSelectedImage(image);
    setNewImageName(image.image_name);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedImage || !newImageName.trim()) return;

    try {
      await updateImageName(selectedImage.image_id, newImageName.trim());

      // Update local state
      setImages(
        images.map((img) =>
          img.image_id === selectedImage.image_id
            ? {
                ...img,
                image_name: newImageName.trim(),
                updated_at: new Date(),
              }
            : img
        )
      );

      setIsEditModalOpen(false);
      setSelectedImage(null); // Clear the selected image when done
    } catch (error) {
      console.error("Error updating image name:", error);
    }
  };

  // Delete image
  const openDeleteModal = (image: Image) => {
    setSelectedImage(image);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedImage) return;

    try {
      await removeFromGallery(selectedImage.image_id);

      // Update local state
      setImages(
        images.filter((image) => image.image_id !== selectedImage.image_id)
      );
      setIsDeleteModalOpen(false);
      setSelectedImage(null); // Clear the selected image when done
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

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

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploadInProgress(true);
    try {
      // Upload each file and add to gallery
      const uploadPromises = selectedFiles.map((file) =>
        uploadImageToGallery(file)
      );

      const newImages = await Promise.all(uploadPromises);

      // Important: Update the images state with the new images to ensure we have complete image objects
      setImages((prevImages) => [...newImages, ...prevImages]);

      // Clean up
      setSelectedFiles([]);
      setSelectedImagePreviews([]);
      setIsUploadModalOpen(false);

      notification.success({
        message: `Successfully uploaded ${newImages.length} images`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      notification.error({ message: "Failed to upload some images" });
    } finally {
      setUploadInProgress(false);
    }
  };

  // Render sort arrow
  const renderSortArrow = (field: keyof Image) => {
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
          <h1 className="text-2xl font-bold text-gray-800">Image Gallery</h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Images
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search images..."
                className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sortBy"
                className="py-2 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                value={sortField}
                onChange={(e) => handleSort(e.target.value as keyof Image)}
              >
                <option value="created_at">Creation Date</option>
                <option value="image_name">Name</option>
                <option value="updated_at">Last Updated</option>
              </select>

              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
                aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
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
                <div
                  key={image.image_id}
                  className="group relative flex flex-col border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.image_name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(image);
                          }}
                          className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Edit image"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(image);
                          }}
                          className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Delete image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div
                      className="text-sm font-medium text-gray-700 truncate"
                      title={image.image_name}
                    >
                      {image.image_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(image.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No images found</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                >
                  Clear search
                </button>
              )}
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
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => {
            if (!uploadInProgress) {
              setIsUploadModalOpen(false);
              setSelectedFiles([]);
              setSelectedImagePreviews([]);
            }
          }}
          title="Upload Images"
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadInProgress}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer flex flex-col items-center justify-center ${uploadInProgress ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag & drop or click to upload images
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (max 5MB per image)
                </p>
              </label>
            </div>

            {selectedImagePreviews.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">
                  Selected {selectedImagePreviews.length} images:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      {!uploadInProgress && (
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white shadow-sm hover:bg-red-700 transition-colors"
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

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFiles([]);
                setSelectedImagePreviews([]);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={uploadInProgress}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                uploadInProgress ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={selectedFiles.length === 0 || uploadInProgress}
            >
              {uploadInProgress && (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              )}
              Upload{" "}
              {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
            </button>
          </div>
        </Modal>

        {/* Edit Name Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Image Name"
        >
          <div className="space-y-4">
            {selectedImage && (
              <div className="flex space-x-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.image_name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="imageName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Image Name
                  </label>
                  <input
                    type="text"
                    id="imageName"
                    value={newImageName}
                    onChange={(e) => setNewImageName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image name"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              disabled={!newImageName.trim()}
            >
              Save
            </button>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            {selectedImage && (
              <>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the image "
                  {selectedImage.image_name}"? This action cannot be undone.
                </p>
                <div className="mt-2 flex justify-center">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.image_name}
                    className="h-40 object-contain rounded-md"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
