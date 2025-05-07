import Loading from "@/components/common/Loading";
import ProductCard from "@/components/user/Product/ProductCard";
import { getProductsByCollectionSlug } from "@/services/client/product";
import { Product } from "@/types/product";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

const SaleSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const result = await getProductsByCollectionSlug("onsale");
      setProducts(result);
      setIsLoading(false);
    };
    getProducts();
  }, []);

  const canSlidePrev = currentSlide > 0;
  const canSlideNext =
    currentSlide < products.length - Math.ceil(slidesPerView);

  return (
    <section className="section-home-sale py-18 bg-red-50">
      <div className="container min-w-full px-4 min850:px-10 min1200:px-12">
        <div className="title flex flex-col mb-4">
          <div className="flex justify-between pt-6">
            <Link
              to={`/collections/onsale`}
              className="hover:text-shop-color-hover text-xl sm:text-4xl font-bold"
              style={{ transition: "all .3s easeInOut" }}
            >
              SẢN PHẨM KHUYẾN MÃI
            </Link>
            <div className="flex gap-4">
              <ArrowLeft
                size={"1.5em"}
                className={clsx(
                  canSlidePrev
                    ? "cursor-pointer hover:scale-110 hover:text-shop-color-hover"
                    : "text-[#959595]"
                )}
                style={{ transition: "all .3s easeInOut" }}
                onClick={() => canSlidePrev && swiperRef.current?.slidePrev()}
              />
              <ArrowRight
                size={"1.5em"}
                className={clsx(
                  canSlideNext
                    ? "cursor-pointer hover:scale-110 hover:text-shop-color-hover"
                    : "text-[#959595]"
                )}
                style={{ transition: "all .3s easeInOut" }}
                onClick={() => canSlideNext && swiperRef.current?.slideNext()}
              />
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-hidden pb-6">
            <Swiper
              spaceBetween={16}
              breakpoints={{
                0: { spaceBetween: 20, slidesPerView: 1.5 },
                750: { spaceBetween: 24, slidesPerView: 2 },
                990: { spaceBetween: 24, slidesPerView: 4 },
                1200: { spaceBetween: 24, slidesPerView: 6 },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                const slidesPerView = swiper.params.slidesPerView;
                setSlidesPerView(
                  typeof slidesPerView === "number" ? slidesPerView : 1
                );
              }}
              onSlideChange={(swiper) => {
                setCurrentSlide(swiper.activeIndex);
                const slidesPerView = swiper.params.slidesPerView;
                setSlidesPerView(
                  typeof slidesPerView === "number" ? slidesPerView : 1
                );
              }}
            >
              {products.map((item, index) => {
                return (
                  <SwiperSlide key={index} className="min-h-full">
                    <ProductCard item={item}></ProductCard>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
        <div className="flex justify-center pb-8">
          <Link
            to={"collections/onsale"}
            className="flex min450:flex-row min450:gap-1 flex-col justify-center items-center bg-white px-7 py-3 border-2 border-slate-400 rounded-md font-light hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500"
          >
            <span>XEM TẤT CẢ </span>
            <span className="font-semibold">SẢN PHẨM KHUYẾN MÃI</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SaleSection;
