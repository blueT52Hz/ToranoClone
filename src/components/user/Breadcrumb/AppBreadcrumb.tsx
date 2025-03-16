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
      <nav className="text-sm px-[50px] bg-[#f5f5f5] min-h-[40px] flex items-center">
        <Breadcrumb items={items}></Breadcrumb>
      </nav>
    </section>
  );
};

export default AppBreadcrumb;
