import { Button } from "antd";
import { calc } from "antd/es/theme/internal";
import clsx from "clsx";
import { AnimatePresence, easeInOut, motion, animate } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface CategorySectionItem {
  name: string;
  img_url: string;
  slug: string;
}

const categorySectionItems: CategorySectionItem[] = [
  {
    name: "Áo khoác",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_category_1_img.jpg?v=663",
    slug: "/collections/ao-khoac",
  },
  {
    name: "Bộ Nỉ",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_category_2_img.jpg?v=663",
    slug: "/collections/bo-ni",
  },
  {
    name: "Quần Jeans",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_category_3_img.jpg?v=663",
    slug: "/collections/quan-jeans",
  },
  {
    name: "Quần Âu",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_category_4_img.jpg?v=663",
    slug: "/collections/quan-au",
  },
  {
    name: "Quần Kaki",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_category_5_img.jpg?v=663",
    slug: "/collections/quan-kaki",
  },
  {
    name: "Sơ Mi",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_category_6_img.jpg?v=663",
    slug: "/collections/so-mi",
  },
  {
    name: "Áo Polo",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_category_7_img.jpg?v=663",
    slug: "/collections/ao-polo",
  },
];

const CategorySection = () => {
  const [perPage, setPerPage] = useState(4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updatePerPage = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1200) setPerPage(4);
      else if (screenWidth >= 992) setPerPage(3);
      else setPerPage(2);
    };

    const handleResize = () => {
      if (currentSlide + perPage > categorySectionItems.length)
        setCurrentSlide(categorySectionItems.length - perPage);
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
      Math.min(categorySectionItems.length - perPage, prev + steps)
    );
  };

  return (
    <section className="section-home-category">
      <div className="container mx-auto px-3">
        <div className="title flex flex-col mb-4">
          <div className="flex justify-between">
            <Link
              to={`/collections/`}
              className="hover:text-shop-color-hover text-xl xs:text-3xl font-bold"
              style={{ transition: "all .3s easeInOut" }}
            >
              <h2>DANH MỤC SẢN PHẨM</h2>
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
                  currentSlide !== categorySectionItems.length - perPage
                    ? "cursor-pointer hover:scale-110 hover:text-shop-color-hover"
                    : "text-[#959595]"
                )}
                style={{ transition: "all .3s easeInOut" }}
                onClick={() => handleIncrease()}
              />
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
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
              {categorySectionItems.map((item, index) => {
                return (
                  <motion.div
                    className={clsx("overflow-hidden pr-4 flex-shrink-0")}
                    key={index}
                    style={{ flexBasis: `${100 / perPage}%` }}
                    animate={{
                      x: `calc(-${currentSlide * 100}%)`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <div className="w-full overflow-hidden relative">
                      <img
                        src={item.img_url}
                        alt={item.name}
                        className="hover:scale-110 object-cover cursor-pointer"
                        draggable={false}
                        style={{ transition: "all 0.5s ease-in-out" }}
                        onClick={() => {
                          if (!isDragging) navigate(`${item.slug}`);
                        }}
                      />
                      <div className="absolute bottom-0 w-full bg-white/45 py-3 px-4 flex justify-between items-center">
                        <Link to={item.slug}>
                          <div
                            className="text-shop-color-title text-base hover:text-shop-color-hover font-medium"
                            style={{ transition: "all 0.3s ease-in-out" }}
                          >
                            {item.name}
                          </div>
                        </Link>
                        <Link to={item.slug}>
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
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
