import React, { useEffect, useRef, useState } from "react";
import { Carousel, Flex } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { div, i } from "framer-motion/client";
import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import clsx from "clsx";

interface Item {
  image_url: string;
  slug: string;
}

const items: Item[] = [
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/slide_1_img.jpg?v=656",
    slug: "/collections/onsale",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/slide_4_img.jpg?v=656",
    slug: "/collections/do-thu-dong",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/slide_2_img.jpg?v=656",
    slug: "/collections/do-thu-dong",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/slide_3_img.jpg?v=656",
    slug: "/collections/new-1",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [duration, setDuration] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const slideSize = items.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleIncrease();
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleOnClickCircle = (index: number) => {
    setCurrentSlide(index);
  };

  const [isHovered, setIsHovered] = useState(false);
  const handleDecrease = () => {
    if (currentSlide === 0) setDuration(0.2);
    else setDuration(0.5);
    setCurrentSlide((currentSlide - 1 + slideSize) % slideSize);
  };

  const handleIncrease = () => {
    if (currentSlide === slideSize - 1) setDuration(0.2);
    else setDuration(0.5);
    setCurrentSlide((currentSlide + 1) % slideSize);
  };

  return (
    <section className="section-home-slider mb-20">
      <motion.div
        className="relative group overflow-hidden"
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
            <div className="flex">
              {items.map((item, i) => (
                <img
                  src={item.image_url}
                  key={i}
                  className="w-full h-full object-cover cursor-pointer select-none"
                  onClick={() => {
                    if (!isDragging) navigate(item.slug);
                  }}
                  draggable={false}
                ></img>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-[#fff] text-shop-color-main hover:text-[#fff] hover:bg-shop-color-main rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-[#fff] text-shop-color-main hover:text-[#fff] hover:bg-shop-color-main rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          className="absolute w-full bottom-2"
          justify="center"
          gap={"0.5rem"}
        >
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-slate-300 opacity-40 cursor-pointer",
                  currentSlide === index ? "opacity-100 bg-[#ff0000]" : ""
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
