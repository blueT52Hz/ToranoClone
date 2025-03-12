import { useState } from "react";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Outfit, ProductImage } from "@/types/product";
import Pagination from "@/components/common/Pagination";

type StatusFilter = "all" | "published" | "draft";

export default function Outfits() {
  const navigate = useNavigate();

  // Sample data
  const [outfits, setOutfits] = useState<Outfit[]>([
    {
      outfit_id: "1",
      outfit_name: "Bộ đồ mùa hè cơ bản",
      image: {
        image_id: "1",
        image_url: `https://picsum.photos/seed/1/600/852`,
        image_name: "summer_outfit.jpg",
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
      },
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      variants: [],
    },
    {
      outfit_id: "2",
      outfit_name: "Trang phục công sở",
      image: {
        image_id: "2",
        image_url: `https://picsum.photos/seed/3/600/852`,
        image_name: "office_outfit.jpg",
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
      },
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      variants: [],
    },
    {
      outfit_id: "3",
      outfit_name: "Outfit dạo phố cuối tuần",
      image: {
        image_id: "3",
        image_url: `https://picsum.photos/seed/2/600/852`,
        image_name: "weekend_outfit.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      published_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      variants: [],
    },
    {
      outfit_id: "4",
      outfit_name: "Set đồ thể thao",
      image: {
        image_id: "4",
        image_url: `https://picsum.photos/seed/4/600/852`,
        image_name: "sport_outfit.jpg",
        created_at: new Date(),
        published_at: new Date(),
        updated_at: new Date(),
      },
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      variants: [],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Sorting state
  const [sortField, setSortField] = useState<keyof Outfit | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Thêm hàm xử lý sắp xếp
  const handleSort = (field: keyof Outfit) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Thay đổi filteredOutfits để bao gồm sắp xếp và lọc trạng thái
  const filteredOutfits = outfits
    .filter((outfit) => {
      // Filter by status
      if (statusFilter === "published" && !outfit.published_at) {
        return false;
      }
      if (statusFilter === "draft" && outfit.published_at) {
        return false;
      }

      // Filter by search term
      return outfit.outfit_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortField) return 0;

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

  // Get paginated data
  const paginatedOutfits = filteredOutfits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);

  const openDeleteModal = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedOutfit) {
      setOutfits(
        outfits.filter((o) => o.outfit_id !== selectedOutfit.outfit_id)
      );
      setIsDeleteModalOpen(false);
      setSelectedOutfit(null);
    }
  };

  // Get status background color
  const getStatusSelectColor = (status: string): string => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Outfits</h1>
        <button
          onClick={() => navigate("/admin/outfits/new")}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Outfit
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Tìm kiếm outfit..."
              className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Filter className="mr-1 h-4 w-4" /> Lọc theo trạng thái:
            </label>
            <div
              className={`${getStatusSelectColor(statusFilter)} rounded-md px-2 py-1 cursor-pointer`}
            >
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className={`text-sm rounded-md shadow-sm cursor-pointer focus:outline-none transition-all ${getStatusSelectColor(statusFilter)}`}
              >
                <option value="all" className="bg-white text-[#000]">
                  Tất cả
                </option>
                <option
                  value="published"
                  className="bg-green-100 text-green-700"
                >
                  Đã xuất bản
                </option>
                <option value="draft" className="bg-gray-100 text-gray-700">
                  Bản nháp
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedOutfits.map((outfit) => (
            <div
              key={outfit.outfit_id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={outfit.image.image_url || "/placeholder.svg"}
                  alt={outfit.outfit_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      outfit.published_at
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {outfit.published_at ? "Đã đăng" : "Bản nháp"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/admin/outfits/${outfit.outfit_id}`)}
                >
                  {outfit.outfit_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ngày tạo: {outfit.created_at.toLocaleDateString("vi-VN")}
                </p>
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/outfits/${outfit.outfit_id}/edit`)
                    }
                    className="flex-1 inline-flex justify-center items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Sửa
                  </button>
                  <button
                    onClick={() => openDeleteModal(outfit)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paginatedOutfits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy outfit nào</p>
          </div>
        )}

        {/* Pagination */}
        {filteredOutfits.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn xóa outfit "{selectedOutfit?.outfit_name}"
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
  );
}
