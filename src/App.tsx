import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "@/layouts/Home/HomeLayout";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import Pages from "@/pages/Pages";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/collections/:slug" element={<Collections />}></Route>
          <Route path="/pages/:slug" element={<Pages />}></Route>
          <Route path="/products/:slug" element={<Products />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
