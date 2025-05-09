import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import React from "react";
import { Link, useLocation } from "react-router-dom";
interface AppBreadcrumbProps {
  items?: ItemType[];
}

const AppBreadcrumb = (props: AppBreadcrumbProps) => {
  const { items = [] } = props;
  return (
    <section className="breadcrumb">
      <nav className="flex min-h-[40px] items-center overflow-hidden bg-[#f5f5f5] px-8 text-sm md:px-[50px]">
        <Breadcrumb items={items}></Breadcrumb>
      </nav>
    </section>
  );
};

export default AppBreadcrumb;
