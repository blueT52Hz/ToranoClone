import { getAllOutfits } from "@/services/admin/outfit";
import { Outfit } from "@/types/product.type";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SwiperSlide } from "swiper/react";
import { Swiper } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

const OutFitSection = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const canSlidePrev = currentSlide > 0;
  const canSlideNext = currentSlide < outfits.length - Math.ceil(slidesPerView);

  useEffect(() => {
    const get = async () => {
      const result = await getAllOutfits();
      setOutfits(result);
    };
    get();
  }, []);
  return (
    <section className="outfit-of-the-day">
      <div className="container flex flex-col gap-8 bg-red-50 px-4 py-8 min850:px-10 min1200:px-12">
        <div className="header-outfit flex justify-between">
          <Link
            to={`/collections/`}
            className="text-xl font-bold hover:text-shop-color-hover sm:text-4xl"
            style={{ transition: "all .3s easeInOut" }}
          >
            <h2>OUTFIT OF THE DAY</h2>
          </Link>
          <div className="flex gap-4">
            <ArrowLeft
              size={"1.5em"}
              className={clsx(
                canSlidePrev
                  ? "cursor-pointer hover:scale-110 hover:text-shop-color-hover"
                  : "text-[#959595]",
              )}
              style={{ transition: "all .3s easeInOut" }}
              onClick={() => canSlidePrev && swiperRef.current?.slidePrev()}
            />
            <ArrowRight
              size={"1.5em"}
              className={clsx(
                canSlideNext
                  ? "cursor-pointer hover:scale-110 hover:text-shop-color-hover"
                  : "text-[#959595]",
              )}
              style={{ transition: "all .3s easeInOut" }}
              onClick={() => canSlideNext && swiperRef.current?.slideNext()}
            />
          </div>
        </div>
        <div className="outfit-content overflow-hidden">
          <Swiper
            spaceBetween={16}
            breakpoints={{
              0: { spaceBetween: 20, slidesPerView: 1.5 },
              750: { spaceBetween: 30, slidesPerView: 2 },
              990: { spaceBetween: 30, slidesPerView: 3 },
              1200: { spaceBetween: 30, slidesPerView: 4 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              const slidesPerView = swiper.params.slidesPerView;
              setSlidesPerView(
                typeof slidesPerView === "number" ? slidesPerView : 1,
              );
            }}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.activeIndex);
              const slidesPerView = swiper.params.slidesPerView;
              setSlidesPerView(
                typeof slidesPerView === "number" ? slidesPerView : 1,
              );
            }}
            className="overflow-hidden"
          >
            {outfits.map((item, index) => {
              return (
                <SwiperSlide key={index} className="cursor-pointer">
                  <img
                    src={item.image.image_url}
                    alt={item.image.image_name}
                  ></img>
                  <div className="text-lg">{item.outfit_name}</div>
                  <div className="flex items-center justify-start">
                    <div className="cursor-pointer rounded-md border-2 border-slate-400 bg-white px-7 py-3 text-sm transition-all duration-500 hover:bg-shop-color-hover hover:text-[#fff]">
                      MUA FULLSET
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default OutFitSection;
