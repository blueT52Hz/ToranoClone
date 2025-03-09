import { v4 as uuidv4 } from "uuid";
import {
  Color,
  Product,
  ProductImage,
  ProductVariant,
  Size,
  mockProducts,
} from "@/types/product";
import {
  Alert,
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Tooltip,
} from "antd";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaLink, FaPinterest, FaTwitter } from "react-icons/fa";
import "@/components/Product/style.css";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { cn } from "@/utils/cn";
import { CartItem } from "@/types/cart";
import { useCart } from "@/context/UserContext";

interface ProductModalProps {
  product_id: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductModal = (props: ProductModalProps) => {
  const { product_id } = props;
  const product = mockProducts.filter(
    (product) => product.product_id === product_id
  )[0];
  console.log(product);

  const [activeImageId, setActiveImageId] = useState(
    product.variants[0].image.image_id
  );
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
    (a, b) => sizeOrder.indexOf(a.size_code) - sizeOrder.indexOf(b.size_code)
  );

  const { isOpenModal, setIsOpenModal } = props;
  const [idSelectedSize, setIdSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [form] = Form.useForm();
  const { addToCart } = useCart();

  useEffect(() => {
    setIdSelectedSize("");
  }, [activeImageId]);

  const handleAddToCart = () => {
    form.submit();
    const item: CartItem = {
      cartItem_id: uuidv4(),
      variant: product.variants.filter(
        (variant) =>
          variant.image.image_id === activeImageId &&
          variant.size.size_id === idSelectedSize
      )[0],
      quantity,
      created_at: new Date(),
      product: product,
    };
    addToCart(item);
    setIsOpenModal(false);
  };

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
      <div className="container h-full mx-auto grid md:grid-cols-2 gap-8 overflow-hidden">
        <div className="product-gallery flex flex-col justify-between pb-4">
          <span className="flex justify-center items-center flex-1">
            <Image
              src={
                product.variant_images.filter(
                  (item) => item.image_id === activeImageId
                )[0].image_url
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
          <h2 className="text-xl font-bold mb-[10px]">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-2">
            Mã sản phẩm: <strong>{product.product_code}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-5">
            Thương hiệu: <strong>{product.brand_name}</strong>
          </p>
          <div className="p-4 mb-5 bg-[#fafafa] w-full flex items-center">
            <span className="min-w-16 block">Giá: </span>
            <span className="text-xl text-[#ff2c26] font-bold">
              {product.sale_price && product.discount
                ? product.sale_price.toLocaleString()
                : product.base_price.toLocaleString()}
              ₫
            </span>
            {product.discount && (
              <>
                <span className="text-[#9e9e9e] text-sm line-through ml-4">
                  {product.base_price.toLocaleString()}₫
                </span>
                <span className="ml-4 bg-[#ff0000] text-white px-2 py-1 text-[10px] rounded-2xl">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Màu sắc:</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {colorsArray.map((color) => (
                <button
                  key={color.color_id}
                  className={`border px-2 py-2 rounded ${
                    product.variants.filter(
                      (variant) => variant.image.image_id === activeImageId
                    )[0].color.color_id === color.color_id
                      ? "border-red-500 border-2"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    setActiveImageId(
                      product.variants.filter(
                        (variant) => variant.color.color_id === color.color_id
                      )[0].image.image_id
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
            <div className="flex flex-wrap gap-2 mt-2">
              {sizesArray.map((size) => {
                const isVariantInStock = product.variants.some(
                  (variant) =>
                    variant.quantity > 0 &&
                    variant.image.image_id === activeImageId &&
                    variant.size.size_id === size.size_id
                );

                return (
                  <button
                    key={size.size_id}
                    className={`relative border px-4 py-2 rounded transition ${
                      idSelectedSize === size.size_id
                        ? "border-red-500 border-2"
                        : "border-gray-300"
                    } ${!isVariantInStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      isVariantInStock && setIdSelectedSize(size.size_id)
                    }
                    disabled={!isVariantInStock}
                  >
                    {size.size_code}
                    {!isVariantInStock && (
                      <X className="absolute inset-0 m-auto opacity-30 w-full h-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <h3 className="font-medium mr-4">Số lượng:</h3>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 border"
            >
              -
            </button>
            <input
              type="number"
              className="w-16 text-center border border-white rounded-md focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={quantity}
              onChange={(e) =>
                setQuantity(parseInt(e.target.value) || quantity)
              }
            />

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 border"
            >
              +
            </button>
          </div>

          <div
            className="mt-6 bg-[#e70505] text-white py-3 px-7 text-base text-center cursor-pointer aspectRatio-[9/16] w-full"
            onClick={handleAddToCart}
          >
            THÊM VÀO GIỎ
          </div>

          <div className="mt-4 flex gap-4 justify-end">
            <FaFacebookF className="text-xl cursor-pointer" />
            <FaTwitter className="text-xl cursor-pointer" />
            <FaPinterest className="text-xl cursor-pointer" />
            <FaLink className="text-xl cursor-pointer" />
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
  product_images: ProductImage[];
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
    <div className="flex flex-col mt-4">
      <div className="title flex flex-col mb-2">
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
                  className={clsx("overflow-hidden flex-shrink-0")}
                  key={index}
                  style={{ flexBasis: `${100 / perPage}%` }}
                  transition={{ duration: 0, ease: "easeInOut" }}
                >
                  <div className="w-full overflow-hidden relative">
                    <img
                      src={item.image_url}
                      className={cn(
                        "object-cover cursor-pointer",
                        activeImageId === item.image_id &&
                          "border-2 border-red-500"
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
