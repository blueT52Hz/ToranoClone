import Loading from "@/components/common/Loading";
import ProductCard from "@/components/user/Product/ProductCard";
import { getProductsByCollectionSlug } from "@/services/client/product";
import { Product } from "@/types/product";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

interface Title {
  name: string;
  slug: string;
}

const headerTitle: Title[] = [
  { name: "SẢN PHẨM NỔI BẬT", slug: "onsale" },
  { name: "ĐỒ THU ĐÔNG", slug: "do-thu-dong" },
  { name: "ĐỒ CÔNG SỞ", slug: "do-cong-so" },
  { name: "ĐỒ THỂ THAO", slug: "do-the-thao" },
];

const FeaturedSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const result = await getProductsByCollectionSlug(
        headerTitle[currentSlide].slug
      );
      setProducts(result);
      setIsLoading(false);
    };
    getProducts();
  }, [currentSlide]);

  return (
    <section className="featured-section my-20">
      <div className="container w-full px-4 min1200:px-12 flex flex-col overflow-hidden">
        <Swiper
          breakpoints={{
            0: { spaceBetween: 24, slidesPerView: "auto" },
            1200: { spaceBetween: 40, slidesPerView: "auto" },
          }}
          observer={true}
          observeParents={true}
          className="header text-base min850:text-xl min1200:text-2xl overflow-hidden"
        >
          {headerTitle.map((item, _i) => {
            return (
              <SwiperSlide key={_i} className="!w-auto overflow-hidden">
                <span
                  className={clsx(
                    "transition-all duration-500 cursor-pointer pb-3 relative text-center",
                    currentSlide === _i
                      ? "text-shop-color-text font-medium"
                      : "text-[#959595] font-light hover:text-shop-color-text opacity-80"
                  )}
                  onClick={() => setCurrentSlide(_i)}
                >
                  <span
                    className={clsx(
                      "relative inline-block",
                      "before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-[1px] before:bg-shop-color-text before:transition-all before:duration-300",
                      currentSlide === _i
                        ? "before:w-full"
                        : "before:w-0 hover:before:w-full"
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
            <div className="grid grid-cols-2 min850:grid-cols-4 min1200:grid-cols-5 min850:gap-4 gap-2">
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
            className="flex min450:flex-row min450:gap-1 flex-col justify-center items-center bg-white px-7 py-3 border-2 border-slate-400 rounded-md font-light hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500"
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

export default FeaturedSection;
