import { getPublishedCollectionsWithImage } from "@/services/client/collection/colelction";
import { Collection } from "@/types/product";
import clsx from "clsx";
import { easeInOut, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

const CategorySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [collections, setCollections] = useState<Collection[]>([]);
  const canSlidePrev = currentSlide > 0;
  const canSlideNext =
    currentSlide < collections.length - Math.ceil(slidesPerView);

  useEffect(() => {
    const getCollection = async () => {
      const result = await getPublishedCollectionsWithImage();
      setCollections(result);
      console.log(result);
    };
    getCollection();
  }, []);

  return (
    <section className="section-home-category mb-20">
      <div className="container min-w-full px-4 min850:px-10 min1200:px-12">
        <div className="title flex flex-col mb-4">
          <div className="flex justify-between">
            <Link
              to={`/collections/all`}
              className="hover:text-shop-color-hover text-xl sm:text-4xl font-bold"
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
            {collections.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="w-full overflow-hidden relative">
                    <img
                      src={item.image.image_url}
                      alt={item.image.image_name}
                      className="hover:scale-110 object-cover cursor-pointer"
                      style={{ transition: "all 0.5s ease-in-out" }}
                      onClick={() => {
                        navigate(`/collections/${item.slug}`);
                      }}
                    />
                    <div className="absolute bottom-0 w-full bg-white/45 py-3 px-4 flex justify-between items-center">
                      <Link to={`/collections/${item.slug}`}>
                        <div
                          className="text-shop-color-title text-base hover:text-shop-color-hover font-medium"
                          style={{ transition: "all 0.3s ease-in-out" }}
                        >
                          {item.name}
                        </div>
                      </Link>
                      <Link to={`/collections/${item.slug}`}>
                        <motion.div
                          className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shadow-inner hover:bg-black hover:text-white cursor-pointer"
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
