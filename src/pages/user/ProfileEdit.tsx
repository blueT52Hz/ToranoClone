import { useState, FormEvent } from "react";
import { useUser } from "@/context/UserContext";
import AccountLayout from "@/layouts/Home/AccountLayout";

const ProfileEdit = () => {
  const { user, updateUser } = useUser();

  if (!user) return <div>Bạn chưa đăng nhập</div>;
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    gender: user.gender,
    date_of_birth: user.date_of_birth,
    email: user.email,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.full_name.trim()) {
      setErrorMessage("Họ tên không được để trống");
      return;
    }

    if (!formData.email.includes("@")) {
      setErrorMessage("Email không hợp lệ");
      return;
    }

    try {
      updateUser(formData);
      setSuccessMessage("Cập nhật thông tin thành công!");
      setErrorMessage("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage("Đã có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

  return (
    <AccountLayout title="Chỉnh sửa hồ sơ">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto my-8">
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Giới tính
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày sinh
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
};

export default ProfileEdit;
