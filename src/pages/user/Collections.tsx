import Loading from "@/components/common/Loading";
import Pagination from "@/components/user/Pagination";
import ProductCard from "@/components/user/Product/ProductCard";
import Sidebar from "@/components/user/SidebarFilter";
import { getProductsByCollectionSlug } from "@/services/client/product";
import { supabase } from "@/services/supabaseClient";
import { Product } from "@/types/product";
import { cn } from "@/utils/cn";
import { Flex, Drawer } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, ListFilterPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const Collections = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const getProducts = async () => {
      if (!slug) return;
      setIsLoading(true);
      const result = await getProductsByCollectionSlug(slug);

      const { data } = await supabase
        .from("collection")
        .select("name")
        .eq("slug", slug)
        .single();

      setProducts(result);
      setCollection(data?.name);
      setIsLoading(false);
    };
    getProducts();
  }, [slug]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container min-w-full px-4 min850:px-12">
      <section className="collection-section py-7">
        <div className="grid grid-cols-4">
          <div className="hidden min850:block sidebar">
            <Sidebar />
          </div>
          {isLoading ? (
            <div className="main-container px-3 flex flex-col min850:col-span-3 col-span-4">
              <Loading />
            </div>
          ) : (
            <div className="main-container px-3 flex flex-col min850:col-span-3 col-span-4">
              <div className="toolbar-main flex flex-col min850:flex-row justify-between mb-[30px]">
                <div className="title-toolbar flex gap-4 items-center">
                  <div className="title-collection text-shop-color-title font-bold text-[22px]">
                    {collection}
                  </div>
                  <div className="product-count text-sm">
                    <span className="font-bold">{products.length}</span>
                    <span className="font-light"> sản phẩm</span>
                  </div>
                </div>
                <div className="product-filter-sort flex items-center justify-between flex-wrap gap-4 text-sm">
                  {isMobile && (
                    <>
                      <button
                        className="px-4 py-2 rounded-md flex justify-between items-center border border-[#dde1ef] gap-2"
                        onClick={onToggleDrawer}
                      >
                        <span>Bộ lọc</span>
                        <ListFilterPlus />
                      </button>
                      <Drawer
                        title={
                          <Flex
                            className="relative w-full flex-row-reverse"
                            justify="space-between"
                            align="flex-end"
                          >
                            <X
                              className="text-slate-500 cursor-pointer"
                              onClick={onToggleDrawer}
                            />
                          </Flex>
                        }
                        onClose={onToggleDrawer}
                        open={openDrawer}
                        placement="left"
                        width={"20rem"}
                        closeIcon={null}
                        className="overflow-auto scrollbar-hidden"
                      >
                        <Sidebar />
                      </Drawer>
                    </>
                  )}
                  <div className="flex gap-4 items-center flex-wrap">
                    {!isMobile && <div>Sắp xếp theo</div>}
                    <DropdownMenu />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 min850:grid-cols-4 min1200:grid-cols-5 min850:gap-4 gap-2">
                {products.map((item, index) => {
                  return (
                    <div key={index}>
                      <ProductCard item={item} />
                    </div>
                  );
                })}
              </div>
              <Pagination total={products.length} currentPage={currentPage} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collections;

const items = [
  "Sản phẩm nổi bật",
  "Giá: Tăng dần",
  "Giá: Giảm dần",
  "Tên: A-Z",
  "Tên: Z-A",
  "Cũ nhất",
  "Mới nhất",
  "Bán chạy nhất",
  "Tồn kho giảm dần",
];

const DropdownMenu = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [selected, setSelected] = useState(items[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="px-4 py-2 rounded-md w-48 flex justify-between items-center border border-[#dde1ef]"
        onClick={() => {
          if (isMobile) setIsOpen(!isOpen);
        }}
      >
        <span>{selected}</span>
        <ChevronDown
          className={cn("transition duration-300", isOpen && "-rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-48 z-50 bg-white shadow-md rounded-md  border border-[#dde1ef]"
          >
            {items.map((item) => (
              <li
                key={item}
                className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  setSelected(item);
                  setIsOpen(false);
                }}
              >
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
