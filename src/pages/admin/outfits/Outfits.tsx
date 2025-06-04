import { useEffect, useState } from "react";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  Filter,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OutfitPreview } from "@/types/outfit.type";
import Pagination from "@/components/common/Pagination";
import Loading from "@/components/common/Loading";
import { outfitApi } from "@/apis/admin/outfit.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { AxiosError } from "axios";
type StatusFilter = "all" | "publish" | "draft" | "archived";
type SortBy = "outfit_name" | "created_at" | "published_at" | "updated_at";

export default function Outfits() {
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState<OutfitPreview[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitPreview | null>(
    null,
  );

  const {
    data: outfitsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["outfits", currentPage, search, statusFilter, sortBy, sortOrder],
    queryFn: () =>
      outfitApi.getOutfits(
        currentPage,
        9,
        search,
        statusFilter,
        sortBy,
        sortOrder,
      ),
  });

  useEffect(() => {
    if (outfitsData?.data?.data) {
      setOutfits(outfitsData.data.data.outfits);
      setTotalPages(outfitsData.data.data.pagination.totalPages);
    }
  }, [outfitsData]);

  // Get status background color
  const getStatusSelectColor = (status: string): string => {
    switch (status) {
      case "publish":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "archived":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Outfits</h1>
        <button
          onClick={() => navigate("/admin/outfits/new")}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm Outfit
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm outfit..."
              className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Filter className="mr-1 h-4 w-4" /> Lọc theo trạng thái:
            </label>
            <div
              className={`${getStatusSelectColor(statusFilter)} cursor-pointer rounded-md px-2 py-1`}
            >
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                aria-label="Lọc theo trạng thái"
                className={`cursor-pointer rounded-md text-sm shadow-sm transition-all focus:outline-none ${getStatusSelectColor(statusFilter)}`}
              >
                <option value="all" className="bg-white text-[#000]">
                  Tất cả
                </option>
                <option value="publish" className="bg-green-100 text-green-700">
                  Đã xuất bản
                </option>
                <option value="draft" className="bg-gray-100 text-gray-700">
                  Bản nháp
                </option>
                <option value="archived" className="bg-red-100 text-red-700">
                  Đã lưu
                </option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Sắp xếp theo:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                aria-label="Sắp xếp theo"
                className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="outfit_name">Tên outfit</option>
                <option value="created_at">Ngày tạo</option>
                <option value="published_at">Ngày xuất bản</option>
                <option value="updated_at">Ngày cập nhật</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="rounded-md border border-gray-300 p-1 hover:bg-gray-50"
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
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {outfits.map((outfit) => (
            <div
              key={outfit.outfit_id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={outfit.image.image_url || "/placeholder.svg"}
                  alt={outfit.outfit_name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-2 top-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs ${
                      outfit.status === "publish"
                        ? "bg-green-100 text-green-700"
                        : outfit.status === "archived"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {outfit.status === "publish"
                      ? "Đã đăng"
                      : outfit.status === "archived"
                        ? "Đã lưu trữ"
                        : "Bản nháp"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="cursor-pointer font-medium text-gray-900 hover:text-blue-600"
                  onClick={() => navigate(`/admin/outfits/${outfit.outfit_id}`)}
                >
                  {outfit.outfit_name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ngày tạo:{" "}
                  {new Date(outfit.created_at).toLocaleDateString("vi-VN")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Ngày cập nhật:{" "}
                  {new Date(outfit.updated_at).toLocaleDateString("vi-VN")}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/outfits/${outfit.outfit_id}`)
                    }
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
                  >
                    <Edit className="mr-1 h-3.5 w-3.5" />
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOutfit(outfit);
                      setIsDeleteModalOpen(true);
                    }}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && outfits.length === 0 && (
          <div className="py-12 text-center">
            <Loading />
          </div>
        )}

        {outfits.length === 0 && !isLoading && (
          <div className="py-12 text-center">
            <p className="text-gray-500">Không tìm thấy outfit nào</p>
          </div>
        )}

        {/* Pagination */}
        {outfits.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => refetch()}
        selectedOutfit={selectedOutfit}
        setSelectedOutfit={setSelectedOutfit}
      />
    </div>
  );
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  selectedOutfit: OutfitPreview | null;
  setSelectedOutfit: (outfit: OutfitPreview | null) => void;
}

const DeleteModal = ({
  isOpen,
  onClose,
  selectedOutfit,
  onDelete,
  setSelectedOutfit,
}: DeleteModalProps) => {
  const deleteMutation = useMutation({
    mutationFn: () => outfitApi.deleteOutfit(selectedOutfit!.outfit_id),
    onSuccess: () => {
      onDelete();
      setSelectedOutfit(null);
      notification.success({
        message: "Xóa outfit thành công",
      });
      onClose();
    },
    onError: (error: AxiosError<{ data: { message: string } }>) => {
      notification.error({
        message: "Xóa outfit thất bại",
        description: error.response?.data.data.message,
      });
    },
  });

  if (!selectedOutfit || !isOpen) return null;

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Xác nhận xóa</h3>
        <p className="mb-6 text-sm text-gray-500">
          Bạn có chắc chắn muốn xóa outfit "{selectedOutfit.outfit_name}" không?
          Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
