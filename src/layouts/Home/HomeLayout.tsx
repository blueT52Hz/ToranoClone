import AppBreadcrumb from "@/components/user/Breadcrumb/AppBreadcrumb";
import Footer from "@/components/user/Footer/Footer";
import { Header } from "@/components/user/Header";
import TopBar from "@/components/user/TopBar/TopBar";
import React from "react";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="flex-col w-full">
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
