import ProductCard from "@/components/Product/ProductCard";
import Item from "antd/es/list/Item";
import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const headerTitle = [
  "SẢN PHẨM NỔI BẬT",
  "ĐỒ THU ĐÔNG",
  "ĐỒ CÔNG SỞ",
  "ĐỒ THỂ THAO",
];

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

const FeaturedSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <section className="featured-section my-20">
      <div className="container min-w-full px-12 flex flex-col">
        <div className="header flex justify-center text-3xl w-full">
          {headerTitle.map((item, _i) => {
            return (
              <div
                key={_i}
                className={clsx(
                  "mx-5 transition-all duration-500 cursor-pointer pb-3 relative",
                  currentSlide === _i
                    ? "text-shop-color-text font-medium"
                    : "text-[#959595] font-light hover:text-shop-color-text opacity-80",
                  "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-shop-color-text before:transition-all before:duration-300",
                  currentSlide === _i ? "before:w-full" : "hover:before:w-full"
                )}
                onClick={() => setCurrentSlide(_i)}
              >
                {item.toUpperCase()}
              </div>
            );
          })}
        </div>
        <div className="collection py-8">
          <div className="grid grid-cols-5 grid-rows-2 gap-4">
            {products.map((item, index) => {
              return (
                <div key={index} className="pr-4">
                  <ProductCard
                    perPage={0}
                    currentSlide={0}
                    item={item}
                    isDragging={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center py-8">
          <Link
            to={"collections/onsale"}
            className="bg-white px-7 py-3 border-2 border-slate-400 rounded-md font-light hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500"
          >
            XEM TẤT CẢ{" "}
            <span className="font-semibold">
              {headerTitle[currentSlide].toUpperCase()}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
