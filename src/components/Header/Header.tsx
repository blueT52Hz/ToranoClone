import { Badge, Button, Drawer, Flex, Popover } from "antd";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Header/Sidebar";
import PopoverCustom from "@/components/Header/PopoverCustom";
import PopoverCollection from "@/components/Header/PopoverCollection";
import Searchbar from "@/components/Header/Seacrhbar";
import ShoppingCart from "@/components/Header/ShoppingCart";
import PopoverUser from "@/components/Header/PopoverUser";

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
      { slug: "quan-", name: "Quần" },
      { slug: "quan-au", name: "Quần Âu" },
      { slug: "quan-jeans", name: "Quần Jeans" },
      { slug: "quan-dai-kaki", name: "Quần Dài Kaki" },
      { slug: "quan-short", name: "Quần Short" },
    ],
  },
];

const collections: Item[] = [
  {
    name: "2023",
    slug: "/",
    sub_items: [
      {
        name: "HORSEBACK",
        slug: "horseback",
      },
      {
        name: "Metropolife",
        slug: "metropolife",
      },
    ],
  },
  {
    name: "2022",
    slug: "/",
    sub_items: [
      {
        name: "Tết trọn yêu thương",
        slug: "tettronyeuthuong",
      },
      {
        name: "Mentime Holiday Collection",
        slug: "mentime",
      },
      {
        name: "Speed Up",
        slug: "speedup",
      },
      {
        name: "RECHARGE",
        slug: "recharge",
      },
      {
        name: "VIBRANCY",
        slug: "vibrancy",
      },
    ],
  },
  {
    name: "2021",
    slug: "/",
    sub_items: [
      {
        name: "VIAGGIO",
        slug: "viaggio-kimly",
      },
      {
        name: "CHEER",
        slug: "cheers",
      },
      {
        name: "TẾT CÓ QUÀ",
        slug: "hoangduc",
      },
      {
        name: "CHAMPION",
        slug: "nmd-champion",
      },
    ],
  },
  {
    name: "2020",
    slug: "/",
    sub_items: [
      {
        name: "CHOSEN BY KIM LY",
        slug: "kimly",
      },
      {
        name: "MASCHILE",
        slug: "maschile",
      },
    ],
  },
];

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <header className="shadow-md">
      <Flex
        align="center"
        className="px-6 min850:px-12 min-h-16"
        justify="space-between"
      >
        {/* Menu Sidebar */}
        <Flex className="block min850:hidden">
          <Button
            type="text"
            variant="outlined"
            icon={<Menu size={"1.5rem"} />}
            onClick={showDrawer}
          ></Button>
          <Drawer
            title={
              <Flex
                className="relative w-full"
                justify="space-between"
                align="center"
              >
                <span>Danh mục</span>
                <X
                  className="text-slate-500 cursor-pointer"
                  onClick={onCloseDrawer}
                />
              </Flex>
            }
            onClose={onCloseDrawer}
            open={openDrawer}
            placement="left"
            width={"20rem"}
            closeIcon={null}
            className="overflow-auto scrollbar-hidden"
          >
            <Sidebar collections={collections} categories={categories} />
          </Drawer>
        </Flex>

        {/* Logo */}
        <div className="bg-white min-w-36 max-w-52 px-4">
          <Link to="/">
            <img
              src="https://theme.hstatic.net/200000690725/1001078549/14/logo.png?v=647"
              alt="logo"
            />
          </Link>
        </div>

        {/* Menu Header */}
        <div className="hidden min850:block">
          <Flex gap={"large"} className="text-base" wrap justify="center">
            <Link to={"/collections/new-1"}>Sản phẩm mới</Link>
            <Link to={"/collections/onsale"}>Sale</Link>
            <PopoverCustom item={categories[0]}></PopoverCustom>
            <PopoverCustom item={categories[1]}></PopoverCustom>
            <PopoverCollection collections={collections}></PopoverCollection>
            <Link to={"/pages/he-thong-cua-hang"}>Hệ thống cửa hàng</Link>
            <Link to={"/pages/tang-voucher-20-30"}>Ưu đãi</Link>
          </Flex>
        </div>

        {/* Menu User */}
        <Flex gap={15}>
          <Searchbar></Searchbar>
          <PopoverUser></PopoverUser>
          <ShoppingCart></ShoppingCart>
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
