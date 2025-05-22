import Loading from "@/components/common/Loading";
import Pagination from "@/components/user/Pagination";
import ProductCard from "@/components/user/Product/ProductCard";
import Sidebar, { FilterState } from "@/components/user/SidebarFilter";
// import { Product } from "@/types/product";
import { cn } from "@/utils/cn";
import { Flex, Drawer, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, ListFilterPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

interface Product {
  product_id: string;
  product_name: string;
  product_slug: string;
  base_price: number;
  sale_price: number | null;
  discount: number | null;
  colors: string[];
  sizes: string[];
  images: string[];
  created_at: string;
}

const sortOptions = [
  {
    label: "Giá: Tăng dần",
    sortFn: (a: Product, b: Product) =>
      (a.sale_price || a.base_price) - (b.sale_price || b.base_price),
  },
  {
    label: "Giá: Giảm dần",
    sortFn: (a: Product, b: Product) =>
      (b.sale_price || b.base_price) - (a.sale_price || a.base_price),
  },
  {
    label: "Tên: A-Z",
    sortFn: (a: Product, b: Product) => a.name.localeCompare(b.name),
  },
  {
    label: "Tên: Z-A",
    sortFn: (a: Product, b: Product) => b.name.localeCompare(a.name),
  },
  {
    label: "Cũ nhất",
    sortFn: (a: Product, b: Product) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  },
  {
    label: "Mới nhất",
    sortFn: (a: Product, b: Product) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  },
];

const Collections = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 3000000],
    sizes: [],
  });

  const onToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const getProducts = async () => {
      if (!slug) {
        navigate("/404");
        return;
      }
      setIsLoading(true);
      try {
        const result = await getProductsByCollectionSlug(slug);
        const { data, error } = await supabase
          .from("collection")
          .select("name")
          .eq("slug", slug)
          .single();

        if (error || !data || result.length === 0) {
          navigate("/404");
          return;
        }

        setProducts(result);
        setFilteredProducts(result);
        setCollection(data.name);
      } catch (error) {
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, [slug, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    let filtered = [...products];

    // Lọc theo khoảng giá
    filtered = filtered.filter(
      (product) =>
        (product.sale_price || product.base_price) >=
          newFilters.priceRange[0] &&
        (product.sale_price || product.base_price) <= newFilters.priceRange[1],
    );

    // Lọc theo size
    if (newFilters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants.some((variant) =>
          newFilters.sizes.includes(variant.size.size_code),
        ),
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (index: number) => {
    const sortedProducts = [...filteredProducts].sort(
      sortOptions[index].sortFn,
    );
    setFilteredProducts(sortedProducts);
  };

  return (
    <div className="container min-w-full px-4 min850:px-12">
      <section className="collection-section py-7">
        <div className="grid grid-cols-4">
          <div className="sidebar hidden min850:block">
            <Sidebar onFilter={handleFilter} filters={filters} />
          </div>
          {isLoading ? (
            <div className="main-container col-span-4 flex flex-col px-3 min850:col-span-3">
              <Loading />
            </div>
          ) : (
            <div className="main-container col-span-4 flex flex-col px-3 min850:col-span-3">
              <div className="toolbar-main mb-[30px] flex flex-col justify-between min850:flex-row">
                <div className="title-toolbar flex items-center gap-4">
                  <div className="title-collection text-[22px] font-bold text-shop-color-title">
                    {collection}
                  </div>
                  <div className="product-count text-sm">
                    <span className="font-bold">{filteredProducts.length}</span>
                    <span className="font-light"> sản phẩm</span>
                  </div>
                </div>
                <div className="product-filter-sort flex flex-wrap items-center justify-between gap-4 text-sm">
                  {isMobile && (
                    <>
                      <button
                        className="flex items-center justify-between gap-2 rounded-md border border-[#dde1ef] px-4 py-2"
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
                              className="cursor-pointer text-slate-500"
                              onClick={onToggleDrawer}
                            />
                          </Flex>
                        }
                        onClose={onToggleDrawer}
                        open={openDrawer}
                        placement="left"
                        width={"20rem"}
                        closeIcon={null}
                        className="scrollbar-hidden overflow-auto"
                      >
                        <Sidebar onFilter={handleFilter} filters={filters} />
                      </Drawer>
                    </>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    {!isMobile && <div>Sắp xếp theo</div>}
                    <Dropdown
                      menu={{
                        items: sortOptions.map((option, index) => ({
                          key: index,
                          label: option.label,
                          onClick: () => handleSort(index),
                        })),
                      }}
                      trigger={["click"]}
                    >
                      <Button>
                        Sắp xếp <DownOutlined />
                      </Button>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 min850:grid-cols-4 min850:gap-4 min1200:grid-cols-5">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item, index) => {
                    return (
                      <div key={index}>
                        <ProductCard item={item} />
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <div className="mb-2 text-xl font-medium text-gray-500">
                      Không tìm thấy sản phẩm phù hợp
                    </div>
                    <div className="text-sm text-gray-400">
                      Vui lòng thử lại với bộ lọc khác
                    </div>
                  </div>
                )}
              </div>
              {filteredProducts.length > 0 && (
                <Pagination
                  total={filteredProducts.length}
                  currentPage={currentPage}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collections;

const items = [
  // "Sản phẩm nổi bật",
  "Giá: Tăng dần",
  "Giá: Giảm dần",
  "Tên: A-Z",
  "Tên: Z-A",
  "Cũ nhất",
  "Mới nhất",
  // "Bán chạy nhất",
  // "Tồn kho giảm dần",
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
        className="flex w-48 items-center justify-between rounded-md border border-[#dde1ef] px-4 py-2"
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
            className="absolute z-50 w-48 rounded-md border border-[#dde1ef] bg-white shadow-md"
          >
            {items.map((item) => (
              <li
                key={item}
                className="cursor-pointer px-4 py-2 hover:bg-gray-300"
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
