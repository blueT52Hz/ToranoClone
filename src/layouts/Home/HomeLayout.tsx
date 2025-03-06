import AppBreadcrumb from "@/components/Breadcrumb/AppBreadcrumb";
import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header";
import TopBar from "@/components/TopBar/TopBar";
import React from "react";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="flex-col w-full">
      <TopBar />
      <Header />
      <AppBreadcrumb />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
