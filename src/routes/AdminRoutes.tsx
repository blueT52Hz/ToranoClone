import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/layouts/Home/AdminLayout";
import AdminLogin from "@/pages/admin/auth/Login";
import Categories from "@/pages/admin/categories/Categories";
import CategoriesCreate from "@/pages/admin/categories/CategoriesCreate";
import CategoriesEdit from "@/pages/admin/categories/CategoriesEdit";
import ColorsPage from "@/pages/admin/Colors";
import Dashboard from "@/pages/admin/Dashboard";
import GalleryPage from "@/pages/admin/Gallery";
import OrderDetailsPage from "@/pages/admin/orders/OrderDetail";
import Orders from "@/pages/admin/orders/Orders";
import OutfitCreate from "@/pages/admin/outfits/OutfitCreate";
import OutfitEdit from "@/pages/admin/outfits/OutfitEdit";
import Outfits from "@/pages/admin/outfits/Outfits";
import ProductCreate from "@/pages/admin/products/ProductCreate";
import ProductEdit from "@/pages/admin/products/ProductEdit";
import Products from "@/pages/admin/products/Products";
import Sizes from "@/pages/admin/Sizes";
import UserDetailPage from "@/pages/admin/users/UserDetail";
import Users from "@/pages/admin/users/Users";
import { Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* ProductPages */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductCreate />} />
        <Route path="/products/:product_id" element={<ProductEdit />} />
        {/* CategoryPages */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/new" element={<CategoriesCreate />} />
        <Route path="/categories/:category_id" element={<CategoriesEdit />} />
        {/* OutfitPages */}
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/outfits/new" element={<OutfitCreate />} />
        <Route path="/outfits/:outfit_id" element={<OutfitEdit />} />
        {/* OrderPages */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        {/* UserPages */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        {/* Pages */}
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/colors" element={<ColorsPage />} />
        <Route path="/sizes" element={<Sizes />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
