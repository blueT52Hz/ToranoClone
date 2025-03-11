import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "@/routes/AdminRoutes";
import UserRoutes from "@/routes/UserRoutes";

const AppRoutes = () => {
  return (
    <>
      <AdminRoutes></AdminRoutes>
      <UserRoutes></UserRoutes>
      {/* <Route path="*" element={<NotFound />} /> */}
    </>
  );
};

export default AppRoutes;
