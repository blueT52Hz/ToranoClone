import { cn } from "@/utils/cn";
import { Slider, SliderSingleProps } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Circle, Dot, Minus, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Sidebar = () => {
  const { slug } = useParams();
  const [tagFilter, setTagFilter] = useState(slug || "");
  const sizeOrder = [
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
  const [priceFilter, setPriceFilter] = useState<[number, number]>([
    0, 3000000,
  ]);
  const sortSizes = (
    sizes: (
      | "S"
      | "M"
      | "L"
      | "XL"
      | "XXL"
      | "31"
      | "32"
      | "33"
      | "34"
      | "35"
      | "36"
      | "37"
      | "38"
      | "39"
      | "40"
    )[]
  ) => {
    return sizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      } else if (indexA !== -1) {
        return -1;
      } else if (indexB !== -1) {
        return 1;
      } else {
        return parseInt(a) - parseInt(b);
      }
    });
  };
  const [sizeFilter, setSizeFilter] = useState<
    (
      | "S"
      | "M"
      | "L"
      | "XL"
      | "XXL"
      | "31"
      | "32"
      | "33"
      | "34"
      | "35"
      | "36"
      | "37"
      | "38"
      | "39"
      | "40"
    )[]
  >([]);

  const [isFilterActive, setIsFilterActive] = useState(false);

  const clearPriceFilter = () => {
    setPriceFilter([0, 3000000]);
  };

  const clearSizeFilter = () => {
    setSizeFilter([]);
  };

  const clearAllFilters = () => {
    setPriceFilter([0, 3000000]);
    setSizeFilter([]);
  };

  const handleClickSize = (
    value:
      | "S"
      | "M"
      | "L"
      | "XL"
      | "XXL"
      | "31"
      | "32"
      | "33"
      | "34"
      | "35"
      | "36"
      | "37"
      | "38"
      | "39"
      | "40"
  ) => {
    if (sizeFilter.includes(value)) {
      setSizeFilter(sizeFilter.filter((item) => item != value));
    } else {
      const updatedSizes = [...sizeFilter, value];
      setSizeFilter(sortSizes(updatedSizes));
    }
  };

  return (
    <div className="left-sidebar min-h-full">
      <div className="sticky-filter sticky top-[4.5rem] flex flex-col px-3 overflow-y-auto">
        {true && (
          <div className="filter-current">
            <div className="title text-[26px] font-bold mb-5">Bạn đang xem</div>
            <div className="list-tags">
              <div className="filter-tags price flex text-xs text-[#5d5d5d] items-center mb-4">
                <X
                  className="cursor-pointer mr-2 w-5 h-5"
                  onClick={clearPriceFilter}
                />
                <div className="">Khoảng giá:</div>
                <div className="font-bold text-sm ml-1">
                  <span>{priceFilter[0].toLocaleString("en-US") + "đ"}</span>
                  <span> - </span>
                  <span>{priceFilter[1].toLocaleString("en-US") + "đ"}</span>
                </div>
              </div>
              <div className="filter-tags price flex text-xs text-[#5d5d5d] items-center mb-4">
                <X
                  className="cursor-pointer mr-2 w-5 h-5 shrink-0"
                  onClick={clearSizeFilter}
                />
                <div className="shrink-0">Size: </div>
                <div className="font-bold text-sm ml-1 line-clamp-1">
                  {sizeFilter.length === 0 ? (
                    <span>Tất cả</span>
                  ) : (
                    sizeFilter.map((item, index) => {
                      const tmp =
                        index === sizeFilter.length - 1 ? item : item + ", ";
                      return <span key={index}>{tmp}</span>;
                    })
                  )}
                </div>
              </div>

              <div
                className="filter-tags remove-all text-shop-color-main cursor-pointer hover:underline text-sm mb-4"
                onClick={clearAllFilters}
              >
                Xóa hết
              </div>
            </div>
          </div>
        )}
        <div className="filter-content">
          <div className="filter-head text-[26px] font-bold mb-5">Bộ lọc</div>
          <div className="filter-options">
            <PriceSlider
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
            ></PriceSlider>
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
  sizeFilter: (
    | "S"
    | "M"
    | "L"
    | "XL"
    | "XXL"
    | "31"
    | "32"
    | "33"
    | "34"
    | "35"
    | "36"
    | "37"
    | "38"
    | "39"
    | "40"
  )[];
  handleClickSize: (
    value:
      | "S"
      | "M"
      | "L"
      | "XL"
      | "XXL"
      | "31"
      | "32"
      | "33"
      | "34"
      | "35"
      | "36"
      | "37"
      | "38"
      | "39"
      | "40"
  ) => void;
}

const SizeFilter = ({ handleClickSize, sizeFilter }: SizeFilterProps) => {
  const value: (
    | "S"
    | "M"
    | "L"
    | "XL"
    | "XXL"
    | "31"
    | "32"
    | "33"
    | "34"
    | "35"
    | "36"
    | "37"
    | "38"
    | "39"
    | "40"
  )[] = [
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
      <div className="grid grid-cols-5 gap-4 mt-4">
        {value.map((item, index) => {
          return (
            <div
              onClick={() => handleClickSize(item)}
              key={index}
              className={cn(
                "p-2 border rounded-md transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-[#000]/60 ",
                sizeFilter.includes(item)
                  ? "bg-[#000] text-[#fff]"
                  : "hover:text-[#fff]"
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
            className={cn("text-sm font-medium my-2")}
          >
            Sản phẩm mới
          </Link>
        </div>
        <div className="flex items-center">
          <Dot size={30} />
          <Link
            to={"/collections/onsale"}
            className={cn("text-sm font-medium my-2")}
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
                      className={"text-xs my-2 text-[#666666] hover:text-black"}
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
  setPriceFilter: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const PriceSlider = (props: PriceSliderProps) => {
  const { priceFilter, setPriceFilter } = props;
  const marks: SliderSingleProps["marks"] = {
    0: {
      label: <div className="mt-2 text-[#999999] text-sm">0đ</div>,
    },
    3000000: {
      label: <div className="mt-2 text-[#999999] text-sm">3,000,000đ</div>,
    },
  };

  const handleChange = (value: [number, number]) => {
    setPriceFilter(value);
  };

  return (
    <OptionExpanseItem title="Khoảng giá">
      <div className="pt-10 pl-4 pr-10">
        <div className="relative">
          <div
            className="border absolute bg-[#f2f2f2] text-black text-xs px-2 py-1 rounded-md transform -translate-x-1/2 -translate-y-full"
            style={{ left: `calc(${(priceFilter[0] / 3000000) * 100}%)` }}
          >
            {priceFilter[0].toLocaleString("vi-VN")}đ
          </div>
          <div
            className="border absolute bg-[#f2f2f2] text-black text-xs px-2 py-1 rounded-md transform -translate-x-1/2 -translate-y-full"
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
    <div className="flex flex-col my-2">
      <div
        className="flex gap-4 items-center cursor-pointer"
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
            open && "-rotate-180"
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
    <div className="flex flex-col my-[10px]">
      <div
        className="flex justify-between cursor-pointer"
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
