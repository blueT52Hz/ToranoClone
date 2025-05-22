import { useUserStore } from "@/store/user/userStore";
import { useNavigate } from "react-router-dom";
import AccountLayout from "@/layouts/Home/AccountLayout";
import { Button } from "antd";
import { format } from "date-fns";

const ProfilePage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <AccountLayout title="Thông tin cá nhân">
      <div className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <div className="mt-1 text-lg">{user.full_name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <div className="mt-1 text-lg">{user.gender}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày sinh
            </label>
            <div className="mt-1 text-lg">
              {format(new Date(user.date_of_birth), "dd/MM/yyyy")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 text-lg">{user.email}</div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="primary"
              onClick={() => navigate("/account/profile/edit")}
              className="bg-blue-500"
            >
              Chỉnh sửa thông tin
            </Button>
            <Button
              onClick={() => navigate("/account/profile/change-password")}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
