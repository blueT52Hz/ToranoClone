import { useEffect, useState } from "react";
import { Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection as HeroSectionType } from "@/types/product.type";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/common/Loading";

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
  const [duration, setDuration] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [heroSections, setHeroSections] = useState<HeroSectionType[]>([]);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
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
  const slideSize = heroSections.length;

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleIncrease();
  //   }, 4000);
  //   return () => clearTimeout(timer);
  // }, [currentSlide]);

  const handleOnClickCircle = (index: number) => {
    setCurrentSlide(index);
  };

  const [isHovered, setIsHovered] = useState(false);
  const handleDecrease = () => {
    if (currentSlide === 0) setDuration(-1000);
    else setDuration(0.5);
    setCurrentSlide((currentSlide - 1 + slideSize) % slideSize);
  };

  const handleIncrease = () => {
    if (currentSlide === slideSize - 1) setDuration(0.2);
    else setDuration(0.5);
    setCurrentSlide((currentSlide + 1) % slideSize);
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <section className="section-home-slider mb-20">
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
          <motion.div
            animate={{ x: `-${currentSlide * 100}%` }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: duration, ease: "easeInOut" }}
            drag="x"
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(event, info) => {
              if (info.offset.x > 50) {
                handleDecrease();
              } else if (info.offset.x < -50) {
                handleIncrease();
              }
              setIsDragging(false);
            }}
          >
            <div className="flex flex-nowrap">
              {heroSections.map((item, i) => (
                <div className="flex-shrink-0 basis-full" key={i}>
                  <img
                    src={item.image.image_url}
                    key={i}
                    className="h-full w-full cursor-pointer select-none object-cover"
                    onClick={() => {
                      if (!isDragging) navigate(item.hero_slug);
                    }}
                    draggable={false}
                  ></img>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                className="absolute left-6 top-1/2 -translate-y-1/2 transform rounded-full bg-[#fff] p-2 text-shop-color-main hover:bg-shop-color-main hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-label="Previous slide"
                onClick={handleDecrease}
              >
                <ChevronLeft size={"2em"} />
              </motion.button>

              <motion.button
                className="absolute right-6 top-1/2 -translate-y-1/2 transform rounded-full bg-[#fff] p-2 text-shop-color-main hover:bg-shop-color-main hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-label="Next slide"
                onClick={handleIncrease}
              >
                <ChevronRight size={"2em"} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <Flex
          className="absolute bottom-2 w-full"
          justify="center"
          gap={"0.5rem"}
        >
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <div
                className={cn(
                  "h-4 w-4 cursor-pointer rounded-full bg-slate-300 opacity-40",
                  currentSlide === index ? "bg-[#ff0000] opacity-100" : "",
                )}
                key={index}
                onClick={() => handleOnClickCircle(index)}
              />
            );
          })}
        </Flex>
      </motion.div>
    </section>
  );
};

export default HeroSection;
