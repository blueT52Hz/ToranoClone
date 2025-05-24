import ProductModal from "@/components/user/Product/ProductModal";
import { Product } from "@/types/product.type";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "@/assets/images/placeholder.svg";
import OptimizedImage from "@/components/common/OptimizedImage";

interface ProductCardProps {
  item: Product;
  className?: string;
}

const ProductCard = (props: ProductCardProps) => {
  const { item, className } = props;
  const [isHoverd, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    if (!isOpenModal) setIsHovered(false);
  }, [isOpenModal]);

  let colorCount = 0;
  let sizeCount = 0;

  if (item.variants) {
    colorCount = item.variants.reduce(
      (acc, variant) => (acc += variant.color.color_id ? 1 : 0),
      0,
    );
    sizeCount = item.variants.reduce(
      (acc, variant) => (acc += variant.size.size_id ? 1 : 0),
      0,
    );
  }

  return (
    <div
      className={clsx(
        "product-wrap min-h-full flex-shrink-0 overflow-hidden bg-white",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isOpenModal && setIsHovered(false)}
    >
      <div className="relative mb-2.5 w-full overflow-hidden pb-[128%]">
        <motion.div className="image cursor-pointer">
          <OptimizedImage
            src={item.variant_images[0]?.image_url || placeholder}
            alt={item.name}
            title={item.name}
            className={clsx(
              "absolute top-1/2 aspect-[4/5] object-cover transition-all duration-500",
              isHoverd ? "opacity-0" : "opacity-100",
            )}
            draggable={false}
            onClick={() => {
              navigate(`/${item.slug}`, { relative: "path" });
            }}
            loading="lazy"
          />
          <img
            src={item.variant_images?.[1]?.image_url || placeholder}
            alt={item.name}
            title={item.name}
            className={clsx(
              "absolute top-1/2 aspect-[4/6] -translate-y-1/2 object-cover transition-all duration-500",
              !isHoverd ? "opacity-0" : "scale-110 opacity-100",
            )}
            draggable={false}
            onClick={() => {
              navigate(`/products/${item.slug}`, { relative: "path" });
            }}
          />
        </motion.div>
        {item.discount !== 0 && (
          <div className="z-100 absolute left-2 top-3 min-w-[52px] rounded-[11px] bg-[#ff0000] px-[10px] py-[5px] text-center text-xs font-semibold leading-none text-[#fff]">
            -{item.discount}%
          </div>
        )}
        <AnimatePresence>
          {isHoverd && (
            <motion.div
              className="z-100 absolute bottom-3 left-0 right-0 flex justify-around gap-4 overflow-hidden px-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                onClick={() => setIsOpenModal(true)}
                className="hover-button flex cursor-pointer items-center gap-2 truncate rounded-md bg-white px-3 py-2 font-semibold transition-all duration-500 hover:bg-shop-color-hover hover:text-[#fff]"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1 inline-block truncate text-xs">
                  THÊM VÀO GIỎ
                </span>
              </div>

              <div
                className="flex cursor-pointer items-center justify-center rounded-md bg-[#333] p-2 text-[#fff]"
                title="Xem nhanh"
                onClick={() => setIsOpenModal(true)}
              >
                <Eye className="h-5 w-5"></Eye>
              </div>
              <ProductModal
                product={item}
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="detail flex flex-col gap-2.5 px-2 text-sm">
        <div className="options flex justify-between font-light leading-relaxed text-shop-color-text">
          <span>+{colorCount} màu sắc</span>
          <span>+{sizeCount} kích cỡ</span>
        </div>
        <Link
          to={item.slug}
          className="product-name line-clamp-2 cursor-pointer text-shop-color-text"
        >
          {item.name}
        </Link>
        <div className="price mb-2 flex items-center gap-2">
          <span className="font-bold text-[#ff2c26]">
            {item.sale_price && item.base_price !== item.sale_price
              ? item.sale_price.toLocaleString("en-US")
              : item.base_price.toLocaleString("en-US")}
            ₫
          </span>
          {item.sale_price && item.base_price !== item.sale_price && (
            <span className="text-xs font-normal text-[#878c8f] line-through">
              {item.base_price.toLocaleString("en-US")}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
