import Pagination from "@/components/Pagination";
import ProductsSection from "@/components/ProductsSection";
import Sidebar from "@/components/SidebarFilter";
import { mockProducts, mockCollections } from "@/types/product";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const Collections = () => {
  const { slug } = useParams();
  const mockCollection = mockCollections[0];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="container min-w-full px-12">
      <section className="collection-section py-7">
        <div className="grid grid-cols-4">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="main-container px-3 flex flex-col col-span-3">
            <div className="toolbar-main flex justify-between mb-[30px]">
              <div className="title-toolbar flex gap-4 items-center">
                <div className="title-collection text-shop-color-title font-bold text-[22px]">
                  {mockCollection.name}
                </div>
                <div className="product-count text-sm">
                  <span className="font-bold">{mockProducts.length}</span>
                  <span className="font-light"> sản phẩm</span>
                </div>
              </div>
              <div className="product-filter-sort flex items-center justify-between">
                {isMobile && <div>Bộ lọc</div>}
                <div className="flex gap-4 items-center">
                  <div>Sắp xếp theo</div>
                  <DropdownMenu />
                </div>
              </div>
            </div>
            <ProductsSection
              columns={4}
              products={mockProducts}
            ></ProductsSection>
            <Pagination totalPages={10} currentPage={currentPage} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;

const items = [
  "Sản phẩm nổi bật",
  "Giá: Tăng dần",
  "Giá: Giảm dần",
  "Tên: A-Z",
  "Tên: Z-A",
  "Cũ nhất",
  "Mới nhất",
  "Bán chạy nhất",
  "Tồn kho giảm dần",
];

const DropdownMenu = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [selected, setSelected] = useState(items[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="px-4 py-2 rounded-md w-48 flex justify-between border border-[#dde1ef]"
        onClick={() => {
          if (isMobile) setIsOpen(!isOpen);
        }}
      >
        <span>{selected}</span>
        <ChevronDown
          className={cn("transition duration-300", isOpen && "-rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-48 z-50 bg-white shadow-md rounded-md  border border-[#dde1ef]"
          >
            {items.map((item) => (
              <li
                key={item}
                className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  setSelected(item);
                  setIsOpen(false);
                }}
              >
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
