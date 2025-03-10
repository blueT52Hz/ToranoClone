import { routeItems } from "@/components/Breadcrumb/constants";
import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const cancelBreadcrumb = [
  "/",
  "/login",
  "/register",
  "/search",
  "/bo-suu-tap-outfit",
];

const AppBreadcrumb = () => {
  const location = useLocation();
  if (cancelBreadcrumb.includes(location.pathname)) return null;
  const breadcrumbItems = routeItems.filter((route) =>
    location.pathname.startsWith(route.slug)
  );

  return (
    <section className="breadcrumb">
      <nav className="text-sm px-[50px] bg-[#f5f5f5]">
        <ul className="flex space-x-2 py-3">
          {breadcrumbItems.map((route, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="pr-2 text-[#ccc]">/</span>}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-500">{route.title}</span>
              ) : (
                <Link to={route.slug} className="">
                  {route.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default AppBreadcrumb;
