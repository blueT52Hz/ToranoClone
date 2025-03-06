import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { relative } from "path";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ProductCardProps {
  perPage: number;
  currentSlide: number;
  item: Product;
  isDragging: boolean;
  className?: string;
}

interface Product {
  name: string;
  slug: string;
  first_img: string;
  second_img: string;
  color: string[];
  size: ("S" | "M" | "L" | "XL")[];
  original_price: number;
  sale_price: number;
  discount: number;
}

const ProductCard = (props: ProductCardProps) => {
  const { perPage, currentSlide, item, isDragging, className } = props;
  const [isHoverd, setIsHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <motion.div
      className={clsx("overflow-hidden flex-shrink-0", className)}
      style={{
        flexBasis: `calc(${100 / perPage}%)`, // Trừ đi 24px để giữ khoảng cách
      }}
      animate={{
        x: `calc(-${currentSlide * 100}%)`,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div
        className="product-wrap bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full pb-[128%] overflow-hidden relative mb-2.5">
          <motion.div className="image cursor-pointer">
            <img
              src={item.first_img}
              alt={item.name}
              title={item.name}
              className={clsx(
                "object-cover absolute top-1/2 -translate-y-1/2 transition-all duration-500",
                isHoverd ? "opacity-0" : "opacity-100"
              )}
              draggable={false}
              onClick={() => {
                if (!isDragging)
                  navigate(`/${item.slug}`, { relative: "path" });
              }}
            />
            <img
              src={item.second_img}
              alt={item.name}
              title={item.name}
              className={clsx(
                "object-cover absolute top-1/2 -translate-y-1/2 transition-all duration-500",
                !isHoverd ? "opacity-0" : "opacity-100 scale-110"
              )}
              draggable={false}
              onClick={() => {
                if (!isDragging)
                  navigate(`/${item.slug}`, { relative: "path" });
              }}
            />
          </motion.div>
          <div className="absolute z-100 top-3 left-2 px-[10px] py-[5px] min-w-[52px] rounded-[11px] bg-[#ff0000] text-center text-xs text-[#fff] font-semibold leading-none">
            -27%
          </div>
          <AnimatePresence>
            {isHoverd && (
              <motion.div
                className="absolute z-100 bottom-3 flex left-0 right-0 justify-around gap-4 px-4 overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="hover-button bg-white flex items-center truncate gap-2 font-semibold px-3 py-2 rounded-md hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500 cursor-pointer">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-1 text-xs truncate inline-block">
                    THÊM VÀO GIỎ
                  </span>
                </div>

                <div
                  className="bg-[#333] text-[#fff] flex items-center justify-center p-2 rounded-md cursor-pointer"
                  title="Xem nhanh"
                >
                  <Eye className="w-5 h-5"></Eye>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="detail flex flex-col px-2 text-sm gap-2.5">
          <div className="options flex justify-between text-shop-color-text leading-relaxed font-light">
            <span>+{item.color.length} màu sắc</span>
            <span>+{item.size.length} kích cỡ</span>
          </div>
          <Link
            to={item.slug}
            className="product-name text-shop-color-text line-clamp-2 cursor-pointer"
          >
            {item.name}
          </Link>
          <div className="price flex gap-2 items-center mb-2">
            <span className="font-bold text-[#ff2c26]">
              {item.sale_price.toLocaleString("en-US")}₫
            </span>
            <span className="font-normal line-through text-xs text-[#878c8f]">
              {item.original_price.toLocaleString("en-US")}₫
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
