import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "@/layouts/Home/HomeLayout";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import Pages from "@/pages/Pages";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StoreLocator from "@/pages/StoreLocator ";
import PromotionPage from "@/pages/Promotion";
import Search from "@/pages/Search";

const App = () => {
  return (
    <Router>
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
          <Route path="/products/:slug" element={<Products />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="accounts/login/:slug" element={<Login />}></Route>
          <Route path="accounts/register" element={<Register />}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
