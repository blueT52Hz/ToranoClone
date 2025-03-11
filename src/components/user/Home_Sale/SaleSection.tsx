import ProductCard from "@/components/user/Product/ProductCard";
import { Product, mockProducts } from "@/types/product";
import clsx from "clsx";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "@components/Home_Sale/style.css";

const SaleSection = () => {
  const [perPage, setPerPage] = useState(6);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updatePerPage = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1200) setPerPage(6);
      else if (screenWidth >= 992) setPerPage(4);
      else setPerPage(2);
    };

    const handleResize = () => {
      if (currentSlide + perPage > mockProducts.length)
        setCurrentSlide(mockProducts.length - perPage);
    };

    updatePerPage();
    handleResize();
    window.addEventListener("resize", updatePerPage);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", updatePerPage);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log(currentSlide);

  const handleDecrease = (steps = 1) => {
    setCurrentSlide((prev) => Math.max(0, prev - steps));
  };

  const handleIncrease = (steps = 1) => {
    setCurrentSlide((prev) =>
      Math.min(mockProducts.length - perPage, prev + steps)
    );
  };
  return (
    <section className="section-home-sale py-18 bg-red-50">
      <div className="container min-w-full px-12">
        <div className="title flex flex-col mb-4">
          <div className="flex justify-between pt-6">
            <Link
              to={`/collections/`}
              className="hover:text-shop-color-hover text-xl sm:text-4xl font-bold"
              style={{ transition: "all .3s easeInOut" }}
            >
              SẢN PHẨM KHUYẾN MÃI
            </Link>
            <div className="flex gap-4 pr-4">
              <ArrowLeft
                size={"1.5em"}
                className={clsx(
                  currentSlide !== 0
                    ? "cursor-pointer hover:scale-110 hover:text-shop-color-hover"
                    : "text-[#959595]"
                )}
                style={{ transition: "all .3s easeInOut" }}
                onClick={() => handleDecrease()}
              />
              <ArrowRight
                size={"1.5em"}
                className={clsx(
                  currentSlide !== mockProducts.length - perPage
                    ? "cursor-pointer hover:scale-110 hover:text-shop-color-hover"
                    : "text-[#959595]"
                )}
                style={{ transition: "all .3s easeInOut" }}
                onClick={() => handleIncrease()}
              />
            </div>
          </div>
        </div>
        <div className="overflow-hidden pb-6">
          <AnimatePresence>
            <motion.div
              transition={{ duration: 0.5, ease: "easeInOut" }}
              drag={"x"}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragStart={() => {
                setIsDragging(true);
              }}
              className="flex"
              onDragEnd={(event, info) => {
                if (info.offset.x > 20) {
                  handleDecrease();
                } else if (info.offset.x < 20) {
                  handleIncrease();
                }
                setIsDragging(false);
              }}
            >
              {mockProducts.map((item, index) => {
                return (
                  <ProductCard
                    key={index}
                    currentSlide={currentSlide}
                    isDragging={isDragging}
                    item={item}
                    perPage={perPage}
                    className="pr-4"
                  ></ProductCard>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center pb-8">
          <Link
            to={"collections/onsale"}
            className="bg-white px-7 py-3 border-2 border-slate-400 rounded-md font-light hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500"
          >
            XEM TẤT CẢ{" "}
            <span className="font-semibold">SẢN PHẨM KHUYẾN MÃI</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SaleSection;
