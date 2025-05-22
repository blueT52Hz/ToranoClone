import { useEffect } from "react";
import ChatButton from "@/components/user/ChatButton/ChatButton";
import Footer from "@/components/user/Footer/Footer";
import { Header } from "@/components/user/Header";
import TopBar from "@/components/user/TopBar/TopBar";
import { Outlet } from "react-router-dom";
import { useUserStore } from "@/store/user/userStore";
import { useAuthStore } from "@/store/user/authStore";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user/user.api";

const HomeLayout = () => {
  const { setUser } = useUserStore();
  const { setToken } = useAuthStore();

  // Lấy token từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  // Query để lấy thông tin user
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => userApi.getProfile(),
    enabled: !!localStorage.getItem("token"), // Chỉ gọi API khi có token
  });

  // Set user info vào store khi có data
  useEffect(() => {
    if (userData?.data) {
      setUser(userData.data.data);
    }
  }, [userData, setUser]);

  return (
    <div className="w-full flex-col">
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatButton />
    </div>
  );
};

export default HomeLayout;
