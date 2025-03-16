import { Routes, Route } from "react-router-dom";
import AdminRoutes from "@/routes/AdminRoutes";
import UserRoutes from "@/routes/UserRoutes";
// import NotFound from "@/pages/NotFound"; // Cần kiểm tra NotFound đã được import đúng chưa

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
