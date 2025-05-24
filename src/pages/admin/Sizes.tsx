import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Edit,
  Plus,
  Search,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import SizeAddModal from "@/components/admin/sizes/SizeAddModal";
import SizeEditModal from "@/components/admin/sizes/SizeEditModal";
import SizeDeleteModal from "@/components/admin/sizes/SizeDeleteModal";
import { Size } from "@/types/size.type";
import Loading from "@/components/common/Loading";
import { useQuery } from "@tanstack/react-query";
import { sizeApi } from "@/apis/admin/size.api";

const SizesPage: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  // Sorting states
  const [sortField, setSortField] = useState<keyof Size | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sizes"],
    queryFn: () => sizeApi.getSizes(),
  });

  useEffect(() => {
    if (data) {
      setSizes(data.data.data.sizes);
    }
  }, [data]);

  // Sorting function
  const handleSort = (field: keyof Size) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort sizes
  const filteredSizes = sizes
    .filter((size) =>
      size.size_code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  // Modal handlers
  const openEditModal = (size: Size) => {
    setSelectedSize(size);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (size: Size) => {
    setSelectedSize(size);
    setIsDeleteModalOpen(true);
  };

  // Render helper functions
  const renderSortIndicator = (field: keyof Size) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 h-3 w-3"></ArrowUpDown>;

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Kích cỡ</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm Kích cỡ
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="search"
                placeholder="Tìm kiếm kích cỡ..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <Loading />
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error.message}</p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th
                      className="cursor-pointer px-4 py-3 font-medium"
                      onClick={() => handleSort("size_code")}
                    >
                      <div className="flex items-center">
                        Mã kích cỡ
                        {renderSortIndicator("size_code")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSizes.map((size) => (
                    <tr key={size.size_id} className="hover:bg-gray-50">
                      <td className="max-w-[150px] truncate px-4 py-3 text-gray-500">
                        {size.size_id}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {size.size_code}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(size)}
                            className="rounded-full p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Sửa</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(size)}
                            className="rounded-full p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSizes.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Không tìm thấy kích cỡ nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SizeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSizeAdded={() => refetch()}
      />

      <SizeEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSizeUpdated={() => refetch()}
        size={selectedSize}
      />

      <SizeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSizeDeleted={() => refetch()}
        size={selectedSize}
      />
    </div>
  );
};

export default SizesPage;
