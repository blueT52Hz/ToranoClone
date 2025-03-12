import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import "@/index.css";

export default function AdminLayout() {
  return (
    <div className="container min-w-full min-h-screen flex bg-gray-50 px-0">
      <div className="min-h-full border-r border-gray-200">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
