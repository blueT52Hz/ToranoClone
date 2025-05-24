import { useEffect, useRef, useState } from "react";
import { Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection as HeroSectionType } from "@/types/product.type";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/common/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";

const items: HeroSectionType[] = [
  {
    image: {
      image_id: uuidv4(),
      image_url:
        "https://theme.hstatic.net/200000690725/1001078549/14/slide_1_img.jpg?v=656",
      image_name: "slide_1_img",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    hero_name: "On Sale",
    hero_slug: "/collections/onsale",
    hero_id: uuidv4(),
  },
  {
    image: {
      image_id: uuidv4(),
      image_url:
        "https://theme.hstatic.net/200000690725/1001078549/14/slide_4_img.jpg?v=656",
      image_name: "slide_4_img",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    hero_name: "Đồ Thu Đông",
    hero_slug: "/collections/do-thu-dong",
    hero_id: uuidv4(),
  },
  {
    image: {
      image_id: uuidv4(),
      image_url:
        "https://theme.hstatic.net/200000690725/1001078549/14/slide_2_img.jpg?v=656",
      image_name: "slide_2_img",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    hero_name: "Đồ Thu Đông",
    hero_slug: "/collections/do-thu-dong",
    hero_id: uuidv4(),
  },
  {
    image: {
      image_id: uuidv4(),
      image_url:
        "https://theme.hstatic.net/200000690725/1001078549/14/slide_3_img.jpg?v=656",
      image_name: "slide_3_img",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    hero_name: "New Collection",
    hero_slug: "/collections/new-1",
    hero_id: uuidv4(),
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<any>(null);
  const [heroSections, setHeroSections] = useState<HeroSectionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getHero = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setHeroSections(items);
        setIsLoading(false);
      }, 100);
    };
    getHero();
  }, []);

  const handleOnClickCircle = (index: number) => {
    setCurrentSlide(index);
    swiperRef.current?.slideToLoop(index);
  };

  if (isLoading) return <Loading />;

  return (
    <section className="section-home-slider mb-5 min850:mb-10 min1200:mb-20">
      <motion.div
        className="group relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                className="absolute left-6 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-[#fff] p-2 text-shop-color-main hover:bg-shop-color-main hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-label="Previous slide"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronLeft size={"2em"} />
              </motion.button>

              <motion.button
                className="absolute right-6 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-[#fff] p-2 text-shop-color-main hover:bg-shop-color-main hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-label="Next slide"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronRight size={"2em"} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex);
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="h-full w-full"
        >
          {heroSections.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="h-full w-full">
                <img
                  src={item.image.image_url}
                  alt={item.hero_name}
                  className="h-full w-full cursor-pointer select-none object-cover"
                  onClick={() => navigate(item.hero_slug)}
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <Flex
          className="absolute bottom-2 z-10 w-full"
          justify="center"
          gap={"0.5rem"}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className={cn(
                "h-4 w-4 cursor-pointer rounded-full bg-slate-300 opacity-40",
                currentSlide === index ? "bg-[#ff0000] opacity-100" : "",
              )}
              key={index}
              onClick={() => handleOnClickCircle(index)}
            />
          ))}
        </Flex>
      </motion.div>
    </section>
  );
};

export default HeroSection;
