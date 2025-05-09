import { v4 as uuidv4 } from "uuid";
import { Color, Product, Image as ImageType, Size } from "@/types/product";
import { Form, Image, Modal } from "antd";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaLink, FaPinterest, FaTwitter } from "react-icons/fa";
import "@/components/user/Product/style.css";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { cn } from "@/utils/cn";
import { CartItem } from "@/types/cart";
import { useCart } from "@/context/UserContext";

interface ProductModalProps {
  product: Product;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductModal = (props: ProductModalProps) => {
  const { product } = props;

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [activeImageId, setActiveImageId] = useState(
    product.variant_images[0]?.image_id || "",
  );

  const { isOpenModal, setIsOpenModal } = props;
  const [idSelectedSize, setIdSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [form] = Form.useForm();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    form.submit();

    if (!idSelectedSize) {
      setErrorMessage("Vui lòng chọn kích thước!");
      return;
    }

    const maxQuantity = product.variants.find(
      (variant) => variant.size.size_id === idSelectedSize,
    )?.quantity;

    if (maxQuantity && quantity > maxQuantity) {
      setErrorMessage("Số lượng sản phẩm không đủ");
      return;
    }

    const item: CartItem = {
      cart_item_id: uuidv4(),
      variant: product.variants.filter(
        (variant) => variant.size.size_id === idSelectedSize,
      )[0],
      quantity,
      created_at: new Date(),
    };
    addToCart(item);
    setIsOpenModal(false);
  };

  useEffect(() => {
    setErrorMessage("");
  }, [activeImageId, idSelectedSize, quantity]);

  const uniqueColorsMap = new Map<string, Color>();
  const uniqueSizesMap = new Map<string, Size>();
  product.variants.forEach((variant) => {
    uniqueColorsMap.set(variant.color.color_id, variant.color);
    uniqueSizesMap.set(variant.size.size_id, variant.size);
  });
  const colorsArray = Array.from(uniqueColorsMap.values());
  const sizesArray = Array.from(uniqueSizesMap.values());
  const sizeOrder = ["S", "M", "L", "XL", "XXL"];
  sizesArray.sort(
    (a, b) => sizeOrder.indexOf(a.size_code) - sizeOrder.indexOf(b.size_code),
  );

  return (
    <Modal
      centered
      open={isOpenModal}
      onCancel={() => {
        setIsOpenModal(false);
      }}
      onClose={() => {
        setIsOpenModal(false);
      }}
      title={null}
      footer={null}
      width={800}
    >
      <div className="container mx-auto grid h-full gap-8 overflow-hidden md:grid-cols-2">
        <div className="product-gallery flex flex-col justify-between pb-4">
          <span className="flex flex-1 items-center justify-center">
            <Image
              src={
                product.variant_images.find(
                  (item) => item.image_id === activeImageId,
                )?.image_url
              }
              className="w-full rounded-lg"
            />
          </span>
          <GallerySlider
            product_images={product.variant_images}
            activeImageId={activeImageId}
            setActiveImageId={setActiveImageId}
          />
        </div>
        <div className="product-detail px-3 py-5">
          <h2 className="mb-[10px] text-xl font-bold">{product.name}</h2>
          <p className="mb-2 text-sm text-gray-600">
            Mã sản phẩm: <strong>{product.product_code}</strong>
          </p>
          <p className="mb-5 text-sm text-gray-600">
            Thương hiệu: <strong>{product.brand_name}</strong>
          </p>
          <div className="mb-5 flex w-full items-center bg-[#fafafa] p-4">
            <span className="block min-w-16">Giá: </span>
            <span className="text-xl font-bold text-[#ff2c26]">
              {product.sale_price && product.discount
                ? product.sale_price.toLocaleString()
                : product.base_price.toLocaleString()}
              ₫
            </span>
            {product.discount > 0 && (
              <>
                <span className="ml-4 text-sm text-[#9e9e9e] line-through">
                  {product.base_price.toLocaleString()}₫
                </span>
                <span className="ml-4 rounded-2xl bg-[#ff0000] px-2 py-1 text-[10px] text-white">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Màu sắc:</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {colorsArray.map((color) => (
                <button
                  key={color.color_id}
                  className={`rounded border px-2 py-2 ${
                    product.variants[0].color.color_id === color.color_id
                      ? "border-2 border-red-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    setActiveImageId(
                      product.variants.filter(
                        (variant) => variant.color.color_id === color.color_id,
                      )[0].image.image_id,
                    );
                  }}
                >
                  {color.color_name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Kích thước:</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizesArray.map((size) => {
                const isVariantInStock = product.variants.some(
                  (variant) =>
                    variant.quantity > 0 &&
                    variant.size.size_id === size.size_id,
                );

                return (
                  <button
                    key={size.size_id}
                    className={`relative rounded border px-4 py-2 transition ${
                      idSelectedSize === size.size_id
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } ${!isVariantInStock ? "cursor-not-allowed opacity-50" : ""}`}
                    onClick={() =>
                      isVariantInStock && setIdSelectedSize(size.size_id)
                    }
                    disabled={!isVariantInStock}
                  >
                    {size.size_code}
                    {!isVariantInStock && (
                      <X className="absolute inset-0 m-auto h-full w-full opacity-30" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <h3 className="mr-4 font-medium">Số lượng:</h3>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="border px-3 py-1"
            >
              -
            </button>
            <input
              type="number"
              className="w-16 rounded-md border border-white text-center focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setQuantity(parseInt(e.target.value) || quantity);
              }}
            />

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="border px-3 py-1"
            >
              +
            </button>
          </div>

          <div className="relative">
            <div className="absolute top-2 flex items-center text-base font-bold text-shop-color-main">
              {errorMessage}
            </div>
          </div>

          <div
            className="aspectRatio-[9/16] mt-10 w-full cursor-pointer bg-[#e70505] px-7 py-3 text-center text-base text-white"
            onClick={handleAddToCart}
          >
            THÊM VÀO GIỎ
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <div className="text-base">Chia sẻ: </div>
            <FaFacebookF className="cursor-pointer text-xl" />
            <FaTwitter className="cursor-pointer text-xl" />
            <FaPinterest className="cursor-pointer text-xl" />
            <FaLink className="cursor-pointer text-xl" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;

interface GallerySliderProps {
  activeImageId: string;
  setActiveImageId: React.Dispatch<React.SetStateAction<string>>;
  product_images: ImageType[];
}

const GallerySlider = (props: GallerySliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { product_images, activeImageId, setActiveImageId } = props;
  const perPage = 5;
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setConstraints({ left: -containerWidth, right: 0 });
    }
  }, []);

  return (
    <div className="mt-4 flex flex-col">
      <div className="title mb-2 flex flex-col">
        <div className="flex justify-between">
          <div className="text-xs" style={{ transition: "all .3s easeInOut" }}>
            <h2>Ảnh mô tả</h2>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <AnimatePresence>
          <motion.div
            ref={containerRef}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            drag={"x"}
            dragConstraints={constraints}
            className="flex gap-4"
          >
            {product_images.map((item, index) => {
              return (
                <motion.div
                  className={clsx("flex-shrink-0 overflow-hidden")}
                  key={index}
                  style={{ flexBasis: `${100 / perPage}%` }}
                  transition={{ duration: 0, ease: "easeInOut" }}
                >
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={item.image_url}
                      className={cn(
                        "cursor-pointer object-cover",
                        activeImageId === item.image_id &&
                          "border-2 border-red-500",
                      )}
                      draggable={false}
                      style={{ transition: "all 0.1s ease-in-out" }}
                      onClick={() => {
                        setActiveImageId(item.image_id);
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
