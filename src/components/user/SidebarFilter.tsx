import { cn } from "@/utils/cn";
import { Slider, SliderSingleProps } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Circle, Dot, Minus, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export interface FilterState {
  priceRange: [number, number];
  sizes: string[];
}

interface SidebarProps {
  onFilter: (filters: FilterState) => void;
  filters: FilterState;
}

const Sidebar = ({ onFilter, filters }: SidebarProps) => {
  const { slug } = useParams();
  const [priceFilter, setPriceFilter] = useState<[number, number]>(
    filters.priceRange,
  );
  const [sizeFilter, setSizeFilter] = useState<string[]>(filters.sizes);

  const clearPriceFilter = () => {
    setPriceFilter([0, 3000000]);
    onFilter({ ...filters, priceRange: [0, 3000000] });
  };

  const clearSizeFilter = () => {
    setSizeFilter([]);
    onFilter({ ...filters, sizes: [] });
  };

  const clearAllFilters = () => {
    setPriceFilter([0, 3000000]);
    setSizeFilter([]);
    onFilter({ priceRange: [0, 3000000], sizes: [] });
  };

  const handleClickSize = (value: string) => {
    let updatedSizes: string[];
    if (sizeFilter.includes(value)) {
      updatedSizes = sizeFilter.filter((item) => item !== value);
    } else {
      updatedSizes = [...sizeFilter, value];
    }
    setSizeFilter(updatedSizes);
    onFilter({ ...filters, sizes: updatedSizes });
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceFilter(value);
    onFilter({ ...filters, priceRange: value });
  };

  return (
    <div className="left-sidebar min-h-full">
      <div className="sticky-filter sticky top-[4.5rem] flex flex-col overflow-y-auto px-3">
        {(priceFilter[0] > 0 ||
          priceFilter[1] < 3000000 ||
          sizeFilter.length > 0) && (
          <div className="filter-current">
            <div className="title mb-5 text-[26px] font-bold">Bạn đang xem</div>
            <div className="list-tags">
              {(priceFilter[0] > 0 || priceFilter[1] < 3000000) && (
                <div className="filter-tags price mb-4 flex items-center text-xs text-[#5d5d5d]">
                  <X
                    className="mr-2 h-5 w-5 cursor-pointer"
                    onClick={clearPriceFilter}
                  />
                  <div className="">Khoảng giá:</div>
                  <div className="ml-1 text-sm font-bold">
                    <span>{priceFilter[0].toLocaleString("en-US") + "đ"}</span>
                    <span> - </span>
                    <span>{priceFilter[1].toLocaleString("en-US") + "đ"}</span>
                  </div>
                </div>
              )}
              {sizeFilter.length > 0 && (
                <div className="filter-tags price mb-4 flex items-center text-xs text-[#5d5d5d]">
                  <X
                    className="mr-2 h-5 w-5 shrink-0 cursor-pointer"
                    onClick={clearSizeFilter}
                  />
                  <div className="shrink-0">Size: </div>
                  <div className="ml-1 line-clamp-1 text-sm font-bold">
                    {sizeFilter.map((item, index) => {
                      const tmp =
                        index === sizeFilter.length - 1 ? item : item + ", ";
                      return <span key={index}>{tmp}</span>;
                    })}
                  </div>
                </div>
              )}

              <div
                className="filter-tags remove-all mb-4 cursor-pointer text-sm text-shop-color-main hover:underline"
                onClick={clearAllFilters}
              >
                Xóa hết
              </div>
            </div>
          </div>
        )}
        <div className="filter-content">
          <div className="filter-head mb-5 text-[26px] font-bold">Bộ lọc</div>
          <div className="filter-options">
            <PriceSlider
              priceFilter={priceFilter}
              setPriceFilter={handlePriceChange}
            />
            <CategoryFilter />
            <SizeFilter
              handleClickSize={handleClickSize}
              sizeFilter={sizeFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

interface SizeFilterProps {
  sizeFilter: string[];
  handleClickSize: (value: string) => void;
}

const SizeFilter = ({ handleClickSize, sizeFilter }: SizeFilterProps) => {
  const value: string[] = [
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
  ];
  return (
    <OptionExpanseItem title="Size">
      <div className="mt-4 grid grid-cols-5 gap-4">
        {value.map((item, index) => {
          return (
            <div
              onClick={() => handleClickSize(item)}
              key={index}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md border p-2 transition-all duration-300 hover:bg-[#000]/60",
                sizeFilter.includes(item)
                  ? "bg-[#000] text-[#fff]"
                  : "hover:text-[#fff]",
              )}
            >
              {item}
            </div>
          );
        })}
      </div>
    </OptionExpanseItem>
  );
};

interface CategoryFilterProps {}

interface Sub_Item {
  slug: string;
  name: string;
}

interface Item {
  name: string;
  slug: string;
  sub_items: Sub_Item[];
}

const categories: Item[] = [
  {
    name: "Áo nam",
    slug: "ao-nam",
    sub_items: [
      { slug: "ao-khoac", name: "Áo Khoác" },
      { slug: "ao-quan-ni", name: "Áo Quần Nỉ" },
      { slug: "ao-len", name: "Áo Len" },
      { slug: "ao-so-mi", name: "Áo Sơ Mi" },
      { slug: "ao-polo", name: "Áo Polo" },
      { slug: "ao-thun", name: "Áo Thun" },
      { slug: "ao-blazer", name: "Áo Blazer" },
    ],
  },
  {
    name: "Quần nam",
    slug: "quan-nam",
    sub_items: [
      { slug: "quan-au", name: "Quần Âu" },
      { slug: "quan-jeans", name: "Quần Jeans" },
      { slug: "quan-dai-kaki", name: "Quần Dài Kaki" },
      { slug: "quan-short", name: "Quần Short" },
    ],
  },
];

const CategoryFilter = () => {
  return (
    <OptionExpanseItem title="Danh mục sản phẩm">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Dot size={30} />
          <Link
            to={"/collections/new-1"}
            className={cn("my-2 text-sm font-medium")}
          >
            Sản phẩm mới
          </Link>
        </div>
        <div className="flex items-center">
          <Dot size={30} />
          <Link
            to={"/collections/onsale"}
            className={cn("my-2 text-sm font-medium")}
          >
            Sale
          </Link>
        </div>
        {categories.map((item, index) => {
          return (
            <SubOptionExpanseItem key={index} title={item.name}>
              <div className="flex flex-col px-7">
                {item.sub_items.map((subItem, subIndex) => {
                  return (
                    <Link
                      key={subIndex}
                      to={"/collections/" + subItem.slug}
                      className={"my-2 text-xs text-[#666666] hover:text-black"}
                    >
                      {subItem.name}
                    </Link>
                  );
                })}
              </div>
            </SubOptionExpanseItem>
          );
        })}
      </div>
    </OptionExpanseItem>
  );
};

interface PriceSliderProps {
  priceFilter: [number, number];
  setPriceFilter: (value: [number, number]) => void;
}

const PriceSlider = (props: PriceSliderProps) => {
  const { priceFilter, setPriceFilter } = props;
  const marks: SliderSingleProps["marks"] = {
    0: {
      label: <div className="mt-2 text-sm text-[#999999]">0đ</div>,
    },
    3000000: {
      label: <div className="mt-2 text-sm text-[#999999]">3,000,000đ</div>,
    },
  };

  const handleChange = (value: [number, number]) => {
    setPriceFilter(value);
  };

  return (
    <OptionExpanseItem title="Khoảng giá">
      <div className="pl-4 pr-10 pt-10">
        <div className="relative">
          <div
            className="absolute -translate-x-1/2 -translate-y-full transform rounded-md border bg-[#f2f2f2] px-2 py-1 text-xs text-black"
            style={{ left: `calc(${(priceFilter[0] / 3000000) * 100}%)` }}
          >
            {priceFilter[0].toLocaleString("vi-VN")}đ
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-full transform rounded-md border bg-[#f2f2f2] px-2 py-1 text-xs text-black"
            style={{
              left: `calc(${(priceFilter[1] / 3000000) * 100}% - 0px)`,
            }}
          >
            {priceFilter[1].toLocaleString("vi-VN")}đ
          </div>
        </div>
        <Slider
          marks={marks}
          range
          min={0}
          max={3000000}
          step={1}
          value={priceFilter}
          onChange={handleChange}
          tooltip={{
            open: false,
          }}
          trackStyle={[{ backgroundColor: "#333333", height: "6px" }]} // Màu của phần đã chọn
          railStyle={{ backgroundColor: "#D1D5DB", height: "6px" }} // Màu của phần chưa chọn
        />
      </div>
    </OptionExpanseItem>
  );
};

interface OptionExpanseItemProps {
  title: string;
  children: React.ReactNode;
}

const SubOptionExpanseItem = (props: OptionExpanseItemProps) => {
  const { title, children } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className="my-2 flex flex-col">
      <div
        className="flex cursor-pointer items-center gap-4"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-start">
          <Dot size={30} />
          <h2 className={cn("text-sm font-medium")}>{title}</h2>
        </div>
        <ChevronDown
          size={"0.875rem"}
          className={cn(
            "transition-transform duration-1000",
            open && "-rotate-180",
          )}
        ></ChevronDown>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OptionExpanseItem = (props: OptionExpanseItemProps) => {
  const { title, children } = props;
  const [open, setOpen] = useState(true);
  return (
    <div className="my-[10px] flex flex-col">
      <div
        className="flex cursor-pointer justify-between"
        onClick={() => setOpen(!open)}
      >
        <h2 className={cn("text-lg font-semibold")}>{title}</h2>
        {open ? <Minus size={"1.2rem"} /> : <Plus size={"1.2rem"} />}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
