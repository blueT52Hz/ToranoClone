import { useEffect, useState } from "react";
import {
  Edit,
  Eye,
  Filter,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/common/Pagination";
import { User } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/admin/user.api";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<
    "Nam" | "Nữ" | "Khác" | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | "banned" | "all"
  >("all");
  // Thêm state cho sắp xếp
  const [sortBy, setSortBy] = useState<
    | "full_name"
    | "email"
    | "gender"
    | "date_of_birth"
    | "status"
    | "created_at"
    | "last_login_at"
    | "updated_at"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      userApi.getUsers(
        currentPage,
        10,
        searchTerm,
        genderFilter,
        statusFilter,
        sortBy,
        sortOrder,
      ),
  });

  useEffect(() => {
    if (usersData) {
      setUsers(usersData.data.data.users || []);
      setTotalPages(usersData.data.data.pagination.totalPages);
    }
  }, [usersData]);

  useEffect(() => {
    setCurrentPage(1);
    refetch();
  }, [searchTerm, genderFilter, statusFilter, sortBy, sortOrder, refetch]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.user_id !== selectedUser.user_id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
        <Link
          to="/users/create"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Thêm người dùng
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="search"
                placeholder="Tìm kiếm theo tên, email..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                title="Giới tính"
                className="rounded-md border-gray-300 text-sm focus:border-blue-600 focus:ring-blue-600"
                value={genderFilter}
                onChange={(e) =>
                  setGenderFilter(
                    e.target.value as "Nam" | "Nữ" | "Khác" | "all",
                  )
                }
              >
                <option value="all">Tất cả giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                title="Trạng thái"
                className="rounded-md border-gray-300 text-sm focus:border-blue-600 focus:ring-blue-600"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "active" | "inactive" | "banned" | "all",
                  )
                }
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="banned">Đã bị cấm</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => {
                    setSortBy("full_name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Tên
                    {sortBy === "full_name" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => {
                    setSortBy("email");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Email
                    {sortBy === "email" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => {
                    setSortBy("gender");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Giới tính
                    {sortBy === "gender" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => {
                    setSortBy("created_at");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Ngày đăng ký
                    {sortBy === "created_at" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => {
                    setSortBy("updated_at");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Ngày cập nhật
                    {sortBy === "updated_at" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => {
                    setSortBy("last_login_at");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Đăng nhập lần cuối
                    {sortBy === "last_login_at" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.full_name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">{user.gender}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(new Date(user.created_at))}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(new Date(user.updated_at))}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(new Date(user.last_login_at))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/users/${user.user_id}`}
                        className="rounded-full p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem chi tiết</span>
                      </Link>

                      <button
                        onClick={() => openDeleteModal(user)}
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
        </div>

        {users.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        )}

        <div className="flex justify-center py-4">
          {users.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Xác nhận xóa
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.full_name}"
              không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
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
      )}
    </div>
  );
}
