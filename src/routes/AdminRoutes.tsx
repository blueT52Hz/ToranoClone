import AdminLayout from "@/layouts/Home/AdminLayout";
import CollectionDetail from "@/pages/admin/collections/CollectionDetail";
import Collections from "@/pages/admin/collections/Collections";
import ColorsPage from "@/pages/admin/Colors";
import Dashboard from "@/pages/admin/Dashboard";
import GalleryPage from "@/pages/admin/Gallery";
import ExampleOrderDetails from "@/pages/admin/orders/OrderDetail";
import Orders from "@/pages/admin/orders/Orders";
import OutfitDetail from "@/pages/admin/outfits/OutfitDetail";
import Outfits from "@/pages/admin/outfits/Outfits";
import ProductEdit from "@/pages/admin/products/ProductEdit";
import Products from "@/pages/admin/products/Products";
import Sizes from "@/pages/admin/Sizes";
import Users from "@/pages/admin/users/Users";
import { Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* ProductPages */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductEdit />} />
        <Route path="/products/:id" element={<ProductEdit />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
        {/* OrderPages */}
        <Route path="/orders" element={<Orders />} />
        {/* CollectionPages */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/new" element={<CollectionDetail />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/collections/:id/edit" element={<CollectionDetail />} />
        {/* OutfitPages */}
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/outfits/new" element={<OutfitDetail />} />
        <Route path="/outfits/:id" element={<OutfitDetail />} />
        <Route path="/outfits/:id/edit" element={<OutfitDetail />} />
        {/* Pages */}
        <Route index element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/colors" element={<ColorsPage />} />
        <Route path="/sizes" element={<Sizes />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
