import Pagination from "@/components/Pagination";
import ProductsSection from "@/components/ProductsSection";
import Sidebar from "@/components/SidebarFilter";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Product {
  name: string;
  slug: string;
  first_img: string;
  second_img: string;
  color: string[];
  size: ("S" | "M" | "L" | "XL")[];
  original_price: number;
  sale_price: number;
  discount: number;
}

const products: Product[] = [
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
  {
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    first_img:
      "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__6__036a37f6aca94d57beaa829d4cc501d4_master.png",
    second_img:
      "https://product.hstatic.net/200000690725/product/54163586200_1acc1fd069_k_7d13c155b90548bb937b919b9eb893c8_master.jpg",
    slug: "products/ao-khoac-da-lon-basic-co-cao-6-fwcl002",
    size: ["S", "M", "L", "XL"],
    original_price: 750000,
    sale_price: 549000,
    discount: 27,
    color: ["Đỏ"],
  },
];

const Collections = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
                  Quần nam
                </div>
                <div className="product-count text-sm">
                  <span className="font-bold">{"12"}</span>
                  <span className="font-light"> sản phẩm</span>
                </div>
              </div>
              <div className="product-filter-sort flex items-center justify-between">
                {isMobile && <div>Bộ lọc</div>}
                <div className="flex gap-4 items-center">
                  <div>Sắp xếp theo</div>
                  {/* <div>Tồn kho giảm dần</div> */}
                  <DropdownMenu />
                </div>
              </div>
            </div>
            <ProductsSection columns={4} products={products}></ProductsSection>
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
