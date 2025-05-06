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
import ProfileEdit from "@/pages/user/ProfileEdit";
import PromotionPage from "@/pages/user/Promotion";
import Register from "@/pages/user/Register";
import Search from "@/pages/user/Search";
import StoreLocator from "@/pages/user/StoreLocator";
import Test from "@/pages/user/Test";
import { Route, Routes } from "react-router-dom";

const UserRoutes = () => {
  return (
    <AppProvider>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
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
          <Route path="/account/profile" element={<ProfileEdit />} />
          <Route path="account/address" element={<AddressManagement />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
        </Route>
      </Routes>
    </AppProvider>
  );
};

export default UserRoutes;
