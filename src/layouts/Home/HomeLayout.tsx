import AppBreadcrumb from "@/components/user/Breadcrumb/AppBreadcrumb";
import ChatButton from "@/components/user/ChatButton/ChatButton";
import Footer from "@/components/user/Footer/Footer";
import { Header } from "@/components/user/Header";
import TopBar from "@/components/user/TopBar/TopBar";
import React from "react";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="w-full flex-col">
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatButton />
    </div>
  );
};

export default HomeLayout;
