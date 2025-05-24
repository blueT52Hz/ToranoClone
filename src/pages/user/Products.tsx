import Loading from "@/components/common/Loading";
import AppBreadcrumb from "@/components/user/Breadcrumb/AppBreadcrumb";
import ProductCard from "@/components/user/Product/ProductCard";
import { useCart } from "@/context/UserContext";
import {
  getProductByProductSlug,
  getProductsByCollectionSlug,
} from "@/services/client/product";
import { CartItem } from "@/types/cart.type";
import { Color, Product, Image, Size } from "@/types/product.type";
import { cn } from "@/utils/cn";
import { Form, Image as ImageComponent } from "antd";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaLink, FaPinterest, FaTwitter } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const policyItem = [
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=666",
    content: "Miễn phí giao hàng cho đơn hàng từ 500K",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=666",
    content: "Hàng phân phối chính hãng 100%",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=666",
    content: "TỔNG ĐÀI 24/7 : 0964942121",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=666",
    content: "ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi còn nguyên tem mác)",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=666",
    content: "Kiểm tra, thanh toán khi nhận hàng COD",
  },
  {
    image_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=666",
    content: "Hỗ trợ bảo hành, đổi sản phẩm tại tất cả store TORANO",
  },
];

const Products = () => {
  const { slug } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [productsRelated, setProductsRelated] = useState<Product[]>([]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const getProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      const result = await getProductByProductSlug(slug);
      setProduct(result);
      const productsRelatedResult = await getProductsByCollectionSlug(
        result.collections[0].slug,
      );
      setProductsRelated(productsRelatedResult);
      setIsLoading(false);
    };
    getProduct();
  }, [slug]);
  if (!product || isLoading) return <Loading />;
  return (
    <>
      <AppBreadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: (
              <span className="cursor-pointer overflow-hidden">
                {"Colelctions"}
              </span>
            ),
            menu: {
              items: product.collections.map((collection) => ({
                key: collection.collection_id,
                label: (
                  <Link to={`/collections/${collection.slug}`}>
                    {collection.name}
                  </Link>
                ),
              })),
            },
          },
          {
            title: (
              <span className="cursor-pointer overflow-hidden">
                {product.name}
              </span>
            ),
          },
        ]}
      ></AppBreadcrumb>
      <section className="product-detail">
        <div className="container min-w-full">
          <ProductOptions product={product} />
          <div className="my-12 flex w-full flex-col items-center justify-center md:px-20">
            <h2 className="mb-4 text-2xl font-bold">Mô tả sản phẩm</h2>
            <div className="relative w-full md:px-10">
              <div
                className={`relative overflow-hidden transition-all ${
                  expanded ? "max-h-full" : "max-h-40"
                }`}
              >
                <p className="text-gray-700">{product.description}</p>

                {!expanded && (
                  <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 font-medium uppercase text-shop-color-main hover:underline"
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
          </div>
          <div className="my-20 flex flex-col items-center justify-center md:px-32">
            <h2 className="mb-4 text-2xl font-bold">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 min850:grid-cols-4 min850:gap-4 min1200:grid-cols-5">
              {productsRelated.map((item, index) => {
                return (
                  <div key={index}>
                    <ProductCard item={item} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;

interface ProductOptionsProps {
  product: Product;
}

const ProductOptions = (props: ProductOptionsProps) => {
  const { product } = props;

  const [activeImageId, setActiveImageId] = useState(
    product.variants[0].image.image_id,
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
    (a, b) => sizeOrder.indexOf(a.size_code) - sizeOrder.indexOf(b.size_code),
  );

  const [idSelectedSize, setIdSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [form] = Form.useForm();
  const { addToCart } = useCart();

  useEffect(() => {
    setIdSelectedSize("");
  }, [activeImageId]);

  const handleAddToCart = () => {
    const item: CartItem = {
      cart_item_id: uuidv4(),
      variant: product.variants.filter(
        (variant) =>
          variant.image.image_id === activeImageId &&
          variant.size.size_id === idSelectedSize,
      )[0],
      quantity,
      created_at: new Date(),
    };
    addToCart(item);
  };

  return (
    <div className="container mx-auto grid grid-cols-1 overflow-hidden px-0 md:grid-cols-3 md:gap-24 min850:px-20">
      <div className="product-gallery mt-4 flex flex-col gap-4 pb-4">
        <span className="my-2 flex items-center justify-center">
          <ImageComponent
            src={
              product.variant_images.find(
                (item) => item.image_id === activeImageId,
              )?.image_url
            }
            className="rounded-lg"
          />
        </span>
        <GallerySlider
          product_images={product.variant_images}
          activeImageId={activeImageId}
          setActiveImageId={setActiveImageId}
        />
      </div>

      <div className="product-detail col-span-2 flex flex-col justify-between md:px-3 md:py-5">
        <div className="flex flex-col">
          <h2 className="mb-[10px] text-xl font-bold">{product.name}</h2>
          <div className="flex gap-4">
            <p className="mb-2 text-sm text-gray-600">
              Mã sản phẩm: <strong>{product.product_code}</strong>
            </p>
            <p className="mb-5 text-sm text-gray-600">
              Thương hiệu: <strong>{product.brand_name}</strong>
            </p>
          </div>
          <div className="flex w-full items-center bg-[#fafafa] p-4">
            <span className="block min-w-16">Giá: </span>
            <span className="text-xl font-bold text-[#ff2c26]">
              {product.sale_price && product.discount > 0
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
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Màu sắc:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {colorsArray.map((color) => (
                  <button
                    key={color.color_id}
                    className={`rounded border px-2 py-2 ${
                      product.variants.find(
                        (variant) => variant.image.image_id === activeImageId,
                      )?.color.color_id === color.color_id
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
                      setActiveImageId(
                        product.variants.filter(
                          (variant) =>
                            variant.color.color_id === color.color_id,
                        )[0].image.image_id,
                      );
                    }}
                  >
                    {color.color_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Kích thước:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizesArray.map((size) => {
                  const isVariantInStock = product.variants.some(
                    (variant) =>
                      variant.quantity > 0 &&
                      variant.image.image_id === activeImageId &&
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
              onChange={(e) =>
                setQuantity(parseInt(e.target.value) || quantity)
              }
            />

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="border px-3 py-1"
            >
              +
            </button>
          </div>

          <div
            className="aspectRatio-[9/16] mt-6 w-full cursor-pointer bg-[#e70505] px-7 py-3 text-center text-base text-white"
            onClick={handleAddToCart}
          >
            THÊM VÀO GIỎ
          </div>

          <div className="my-4 mt-4 flex justify-end gap-4">
            <div>Chia sẻ: </div>
            <FaFacebookF className="cursor-pointer text-xl" />
            <FaTwitter className="cursor-pointer text-xl" />
            <FaPinterest className="cursor-pointer text-xl" />
            <FaLink className="cursor-pointer text-xl" />
          </div>
        </div>
        <div className="grid min-w-full grid-cols-1 gap-8 min450:grid-cols-2 min450:gap-4 md:grid-cols-3">
          {policyItem.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <img
                src={item.image_url}
                alt={item.content}
                className="h-8 w-8"
              />
              <p className="text-xs">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface GallerySliderProps {
  activeImageId: string;
  setActiveImageId: React.Dispatch<React.SetStateAction<string>>;
  product_images: Image[];
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
    <div className="flex flex-1 flex-col justify-center">
      <div className="title mb-2 flex flex-col">
        <div className="flex justify-between">
          <div
            className="text-center text-sm"
            style={{ transition: "all .3s easeInOut" }}
          >
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
                      alt={`Product image ${index + 1}`}
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
