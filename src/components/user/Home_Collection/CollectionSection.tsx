import ProductCard from "@/components/user/Product/ProductCard";
import { Product } from "@/types/product";
import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const headerTitle = ["Áo Khoác", "Bộ Nỉ", "Sơ Mi - Quần Dài", "Áo Polo"];

const CollectionSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
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
                  "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-shop-color-text before:transition-all before:duration-300",
                  currentSlide === _i ? "before:w-full" : "hover:before:w-full"
                )}
                onClick={() => setCurrentSlide(_i)}
              >
                {item}
              </div>
            );
          })}
        </div>
        <div className="collection py-8">
          <div className="grid grid-cols-5 gap-4">
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

export default CollectionSection;
