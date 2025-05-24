import Loading from "@/components/common/Loading";
import ProductCard from "@/components/user/Product/ProductCard";
import { getProductsByCollectionSlug } from "@/services/client/product";
import { Product } from "@/types/product.type";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";

interface Title {
  name: string;
  slug: string;
}

const headerTitle: Title[] = [
  { name: "Áo khoác", slug: "ao-khoac" },
  { name: "Bộ nỉ", slug: "bo-ni" },
  { name: "Sơ mi - Quần dài", slug: "so-mi-quan-dai" },
  { name: "Áo polo", slug: "ao-polo" },
];

const CollectionSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const result = await getProductsByCollectionSlug(
        headerTitle[currentSlide].slug,
      );
      setProducts(result);
      setIsLoading(false);
    };
    getProducts();
  }, [currentSlide]);

  return (
    <section className="featured-section my-20">
      <div className="container flex min-w-full flex-col px-4 min850:px-10 min1200:px-12">
        <Swiper
          breakpoints={{
            0: { spaceBetween: 24, slidesPerView: "auto" },
            1200: { spaceBetween: 40, slidesPerView: "auto" },
          }}
          observer={true}
          observeParents={true}
          className="header overflow-hidden text-base min850:text-xl min1200:text-2xl"
        >
          {headerTitle.map((item, _i) => {
            return (
              <SwiperSlide key={_i} className="!w-auto overflow-hidden">
                <span
                  className={clsx(
                    "relative cursor-pointer pb-3 text-center transition-all duration-500",
                    currentSlide === _i
                      ? "font-medium text-shop-color-text"
                      : "font-light text-[#959595] opacity-80 hover:text-shop-color-text",
                  )}
                  onClick={() => setCurrentSlide(_i)}
                >
                  <span
                    className={clsx(
                      "relative inline-block",
                      "before:absolute before:bottom-0 before:left-0 before:h-[1px] before:bg-shop-color-text before:transition-all before:duration-300 before:content-['']",
                      currentSlide === _i
                        ? "before:w-full"
                        : "before:w-0 hover:before:w-full",
                    )}
                  >
                    {item.name.toUpperCase()}
                  </span>
                </span>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="collection py-8">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 gap-2 min850:grid-cols-4 min850:gap-4 min1200:grid-cols-5">
              {products.map((item, index) => {
                return (
                  <div key={index}>
                    <ProductCard item={item} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-center pb-8">
          <Link
            to={"collections/onsale"}
            className="flex flex-col items-center justify-center rounded-md border-2 border-slate-400 bg-white px-7 py-3 font-light transition-all duration-500 hover:bg-shop-color-hover hover:text-[#fff] min450:flex-row min450:gap-1"
          >
            <span>XEM TẤT CẢ </span>
            <span className="font-semibold">
              {headerTitle[currentSlide].name.toUpperCase()}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
