import Pagination from "@/components/Pagination";
import ProductsSection from "@/components/ProductsSection";
import Sidebar from "@/components/SidebarFilter";
import { cn } from "@/utils/cn";
import { Divider } from "antd";
import { AnimatePresence, motion } from "framer-motion";
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

const Search = () => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q");
  const type = searchParams.get("type");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="container min-w-full px-12">
      <section className="search-section py-7">
        <div className="search-header">
          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl mb-[10px] font-bold">Tìm kiếm</div>
            <div className="">
              Có <b>{"53"} </b>
              sản phẩm cho tìm kiếm
            </div>
          </div>
        </div>
        <Divider />
        <div className="mb-4 text-lg">
          Kết quả tìm kiếm cho <strong>{q}.</strong>
        </div>
        <ProductsSection columns={5} products={products}></ProductsSection>
        <Pagination totalPages={10} currentPage={currentPage} />
      </section>
    </div>
  );
};

export default Search;
