import Loading from "@/components/common/Loading";
import AppBreadcrumb from "@/components/user/Breadcrumb/AppBreadcrumb";
import ProductsSection from "@/components/user/ProductsSection";
import { useCart } from "@/context/UserContext";
import {
  getProductByProductSlug,
  getProductsByCollectionSlug,
} from "@/services/client/product";
import { CartItem } from "@/types/cart";
import { Color, Product, Image, Size, Collection } from "@/types/product";
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
  // const [collections, setCollections] = useState<Collection[]>([]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const getProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      const result = await getProductByProductSlug(slug);
      setProduct(result);
      const productsRelatedResult = await getProductsByCollectionSlug(
        result.collections[0].slug
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
            title: <span className="cursor-pointer">{"Colelctions"}</span>,
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
            title: <span className="cursor-pointer">{product.name}</span>,
          },
        ]}
      ></AppBreadcrumb>
      <section className="product-detail">
        <div className="container min-w-full">
          <ProductOptions product={product} />
          <div className="flex flex-col justify-center items-center px-20 my-12 w-full">
            <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
            <div className="relative w-full px-10">
              <div
                className={`relative overflow-hidden transition-all ${
                  expanded ? "max-h-full" : "max-h-40"
                }`}
              >
                <p className="text-gray-700">{product.description}</p>

                {!expanded && (
                  <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 text-shop-color-main hover:underline font-medium uppercase"
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center px-32 my-20">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
            <ProductsSection
              products={productsRelated}
              columns={5}
              gap={20}
            ></ProductsSection>
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
          variant.size.size_id === idSelectedSize
      )[0],
      quantity,
      created_at: new Date(),
    };
    addToCart(item);
  };

  return (
    <div className="container mx-auto grid md:grid-cols-3 gap-24 overflow-hidden px-20">
      <div className="product-gallery flex flex-col pb-4 mt-4 gap-4">
        <span className="flex justify-center items-center my-2">
          <ImageComponent
            src={
              product.variant_images.find(
                (item) => item.image_id === activeImageId
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

      <div className="product-detail px-3 py-5 flex flex-col justify-between col-span-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-[10px]">{product.name}</h2>
          <div className="flex gap-4">
            <p className="text-sm text-gray-600 mb-2">
              Mã sản phẩm: <strong>{product.product_code}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-5">
              Thương hiệu: <strong>{product.brand_name}</strong>
            </p>
          </div>
          <div className="p-4 bg-[#fafafa] w-full flex items-center">
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
            <div className="flex gap-4 items-center">
              <h3 className="font-medium">Màu sắc:</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {colorsArray.map((color) => (
                  <button
                    key={color.color_id}
                    className={`border px-2 py-2 rounded ${
                      product.variants.find(
                        (variant) => variant.image.image_id === activeImageId
                      )?.color.color_id === color.color_id
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
          </div>

          <div className="mt-4">
            <div className="flex gap-4 items-center">
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

          <div className="mt-4 flex gap-4 justify-end my-4">
            <div>Chia sẻ: </div>
            <FaFacebookF className="text-xl cursor-pointer" />
            <FaTwitter className="text-xl cursor-pointer" />
            <FaPinterest className="text-xl cursor-pointer" />
            <FaLink className="text-xl cursor-pointer" />
          </div>
        </div>
        <div className="grid grid-cols-3 min-w-full gap-4">
          {policyItem.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <img src={item.image_url} className="w-8 h-8" />
              <p className="text-xs ">{item.content}</p>
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
    <div className="flex flex-col flex-1 justify-center">
      <div className="title flex flex-col mb-2">
        <div className="flex justify-between">
          <div
            className="text-sm text-center"
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
