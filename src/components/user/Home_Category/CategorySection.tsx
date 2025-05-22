import clsx from "clsx";
import { easeInOut, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/apis/user/category.api";
import { Category } from "@/types/category.type";

const CategorySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const canSlidePrev = currentSlide > 0;
  const canSlideNext =
    currentSlide < categories.length - Math.ceil(slidesPerView);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });

  useEffect(() => {
    if (data) {
      setCategories(data.data.data);
    }
  }, [data]);

  return (
    <section className="section-home-category mb-20">
      <div className="container min-w-full px-4 min850:px-10 min1200:px-12">
        <div className="title mb-4 flex flex-col">
          <div className="flex justify-between">
            <Link
              to={`/collections/all`}
              className="text-xl font-bold hover:text-shop-color-hover sm:text-4xl"
              style={{ transition: "all .3s easeInOut" }}
            >
              <h2>DANH MỤC SẢN PHẨM</h2>
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
        </div>
        <div className="overflow-hidden">
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
          >
            {categories.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={item.image.image_url}
                      alt={item.image.image_alt}
                      className="cursor-pointer object-cover hover:scale-110"
                      style={{ transition: "all 0.5s ease-in-out" }}
                      onClick={() => {
                        navigate(`/collections/${item.category_slug}`);
                      }}
                    />
                    <div className="absolute bottom-0 flex w-full items-center justify-between bg-white/45 px-4 py-3">
                      <Link to={`/collections/${item.category_slug}`}>
                        <div
                          className="text-base font-medium text-shop-color-title hover:text-shop-color-hover"
                          style={{ transition: "all 0.3s ease-in-out" }}
                        >
                          {item.category_name}
                        </div>
                      </Link>
                      <Link to={`/collections/${item.category_slug}`}>
                        <motion.div
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white p-1 shadow-inner hover:bg-black hover:text-white"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2, ease: easeInOut }}
                        >
                          <ArrowRight size={"1.5em"} />
                        </motion.div>
                      </Link>
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

export default CategorySection;
