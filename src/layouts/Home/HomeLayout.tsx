import TopBar from "@/components/TopBar/TopBar";
import React from "react";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="flex-col">
      <TopBar />
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default HomeLayout;
