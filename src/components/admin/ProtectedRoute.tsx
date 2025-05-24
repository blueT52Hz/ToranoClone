import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "@/store/admin/authStore";
import { useAdminStore } from "@/store/admin/adminStore";
import { adminApi } from "@/apis/admin/admin.api";
import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { setAdminToken } = useAdminAuthStore();
  const { setAdmin } = useAdminStore();
  const token = localStorage.getItem("adminToken");

  // Kiểm tra token và lấy thông tin admin
  const { data: profileData, error } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: () => adminApi.getProfile(),
    enabled: !!token,
    retry: 1,
  });

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Set token vào store
    setAdminToken(token);
  }, [token, setAdminToken, navigate]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Lỗi xác thực",
        description: "Không thể lấy thông tin admin. Vui lòng đăng nhập lại.",
      });
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
      return;
    }

    if (profileData?.data?.data) {
      setAdmin(profileData.data.data);
    } else if (profileData && !profileData.data?.data) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Không tìm thấy thông tin admin",
      });
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  }, [profileData, error, setAdmin, navigate]);

  // Nếu không có token, không render children
  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
