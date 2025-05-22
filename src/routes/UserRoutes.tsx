import AppProvider from "@/context/AppContext";
import HomeLayout from "@/layouts/Home/HomeLayout";
import AddressManagement from "@/pages/user/AddressManagement";
import Cart from "@/pages/user/Cart";
import { Checkout } from "@/pages/user/CheckOut";
import Collections from "@/pages/user/Collections";
import Home from "@/pages/user/Home";
import Login from "@/pages/user/Login";
import OutFit from "@/pages/user/OutFit";
import Payment from "@/pages/user/Payment";
import Products from "@/pages/user/Products";
import UserProfile from "@/pages/user/UserProfile";
import PromotionPage from "@/pages/user/Promotion";
import Register from "@/pages/user/Register";
import Search from "@/pages/user/Search";
import StoreLocator from "@/pages/user/StoreLocator";
import NotFound from "@/pages/user/NotFound";
import { Routes, Route, Navigate } from "react-router-dom";
import EditProfile from "@/pages/user/EditProfile";
import ChangePassword from "@/pages/user/ChangePassword";

const UserRoutes = () => {
  return (
    <AppProvider>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:slug" element={<Collections />} />
          <Route path="/pages/he-thong-cua-hang" element={<StoreLocator />} />
          <Route path="/pages/tang-voucher-20-30" element={<PromotionPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bo-suu-tap-outfit" element={<OutFit />} />
          <Route path="/products/:slug" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/accounts/login" element={<Login />} />
          <Route path="/accounts/register" element={<Register />} />
          {/* <Route path="/accounts/user/:userId" element={<UserDetailPage />} /> */}
          <Route path="/account/profile" element={<UserProfile />} />
          <Route path="/account/profile/edit" element={<EditProfile />} />
          <Route
            path="/account/profile/change-password"
            element={<ChangePassword />}
          />
          <Route path="account/address" element={<AddressManagement />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </AppProvider>
  );
};

export default UserRoutes;
