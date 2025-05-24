import React, { useState, useEffect } from "react";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import ColorAddModal from "@/components/admin/colors/ColorAddModal";
import ColorEditModal from "@/components/admin/colors/ColorEditModal";
import ColorDeleteModal from "@/components/admin/colors/ColorDeleteModal";
import { Color } from "@/types/color.type";
import Loading from "@/components/common/Loading";
import { colorApi } from "@/apis/admin/color.api";
import { useQuery } from "@tanstack/react-query";

const ColorsPage: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: colorsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["colors"],
    queryFn: () => colorApi.getColors(),
  });

  useEffect(() => {
    if (colorsData) {
      setColors(colorsData.data.data.colors);
    }
  }, [colorsData]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  // Sorting states
  const [sortField, setSortField] = useState<keyof Color | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sorting function
  const handleSort = (field: keyof Color) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort colors
  const filteredColors = colors
    .filter(
      (color) =>
        color.color_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.color_code.toLowerCase().includes(searchTerm.toLowerCase()),
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
  const openEditModal = (color: Color) => {
    setSelectedColor(color);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (color: Color) => {
    setSelectedColor(color);
    setIsDeleteModalOpen(true);
  };

  // Render helper functions
  const renderSortIndicator = (field: keyof Color) => {
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Màu sắc</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm Màu sắc
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="search"
                placeholder="Tìm kiếm màu sắc..."
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
                    <th
                      className="cursor-pointer px-4 py-3 font-medium"
                      onClick={() => handleSort("color_code")}
                    >
                      <div className="flex items-center">
                        Mã màu
                        {renderSortIndicator("color_code")}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 font-medium"
                      onClick={() => handleSort("color_name")}
                    >
                      <div className="flex items-center">
                        Tên
                        {renderSortIndicator("color_name")}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 font-medium"
                      onClick={() => handleSort("color_name")}
                    >
                      <div className="flex items-center">
                        Thời gian tạo
                        {renderSortIndicator("created_at")}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 font-medium"
                      onClick={() => handleSort("color_name")}
                    >
                      <div className="flex items-center">
                        Thời gian cập nhật
                        {renderSortIndicator("updated_at")}
                      </div>
                    </th>

                    <th className="px-4 py-3 text-right font-medium">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredColors.map((color) => (
                    <tr key={color.color_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">
                        {color.color_code}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {color.color_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(color.created_at).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(color.updated_at).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(color)}
                            className="rounded-full p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Sửa</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(color)}
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

              {filteredColors.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Không tìm thấy màu sắc nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ColorAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onColorAdded={() => refetch()}
      />

      <ColorEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onColorUpdated={() => refetch()}
        color={selectedColor}
      />

      <ColorDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onColorDeleted={() => refetch()}
        color={selectedColor}
      />
    </div>
  );
};

export default ColorsPage;
