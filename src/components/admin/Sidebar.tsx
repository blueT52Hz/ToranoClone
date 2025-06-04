import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  Shirt,
  Palette,
  Ruler,
  ImageIcon,
  ShoppingBag,
  Users,
  ChevronLeft,
  Menu,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { name: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { name: "Sản phẩm", href: "products", icon: Package },
  { name: "Danh mục", href: "categories", icon: Layers },
  { name: "Outfits", href: "outfits", icon: Shirt },
  { name: "Màu sắc", href: "colors", icon: Palette },
  { name: "Kích cỡ", href: "sizes", icon: Ruler },
  { name: "Thư viện ảnh", href: "gallery", icon: ImageIcon },
  { name: "Đơn hàng", href: "orders", icon: ShoppingBag },
  { name: "Người dùng", href: "users", icon: Users },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="sticky inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={clsx(
          isCollapsed ? "w-16" : "w-64",
          "sticky top-0 z-30 flex flex-col bg-slate-50 text-slate-800 transition-all duration-300 ease-in-out",
          {
            "-translate-x-full": isMobile && isCollapsed,
            "translate-x-0": !(isMobile && isCollapsed),
          },
        )}
      >
        <div
          className={clsx(
            "flex items-center border-b border-slate-200 p-4",
            { "justify-center": isCollapsed },
            { "justify-between": !isCollapsed },
          )}
        >
          <NavLink
            to="/admin/dashboard"
            className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
          >
            <span
              className={`text-2xl font-bold text-black ${isCollapsed ? "hidden" : "block"}`}
            >
              TORANO
            </span>
          </NavLink>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-slate-600 hover:bg-slate-200"
          >
            {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center ${
                      isCollapsed ? "justify-center" : ""
                    } rounded-md px-3 py-2 text-base ${
                      isActive
                        ? "bg-blue-50 font-medium text-blue-600"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon
                    className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`}
                  />
                  <span className={isCollapsed ? "hidden" : "block"}>
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && isCollapsed && (
        <button
          title="Mở sidebar"
          onClick={toggleSidebar}
          className="sticky bottom-4 left-4 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg md:hidden"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}
