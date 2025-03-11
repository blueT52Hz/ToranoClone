import AppProvider from "@/context/AppContext";
import HomeLayout from "@/layouts/Home/HomeLayout";
import Cart from "@/pages/user/Cart";
import Collections from "@/pages/user/Collections";
import Home from "@/pages/user/Home";
import Login from "@/pages/user/Login";
import OutFit from "@/pages/user/OutFit";
import Products from "@/pages/user/Products";
import PromotionPage from "@/pages/user/Promotion";
import Register from "@/pages/user/Register";
import Search from "@/pages/user/Search";
import StoreLocator from "@/pages/user/StoreLocator ";
import { Route, Routes } from "react-router-dom";

const UserRoutes = () => {
  return (
    <AppProvider>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/collections/:slug" element={<Collections />}></Route>
          <Route
            path="/pages/he-thong-cua-hang"
            element={<StoreLocator />}
          ></Route>
          <Route
            path="/pages/tang-voucher-20-30"
            element={<PromotionPage />}
          ></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/bo-suu-tap-outfit" element={<OutFit />}></Route>
          <Route path="/products/:slug" element={<Products />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="accounts/login" element={<Login />}></Route>
          <Route path="accounts/register" element={<Register />}></Route>
        </Route>
      </Routes>
    </AppProvider>
  );
};

export default UserRoutes;
