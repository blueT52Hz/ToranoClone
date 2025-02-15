import { cn } from "@/utils/cn";
import { Divider, Flex } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Contact {
  slug: string;
  name: string;
}

const GroupLinks = () => {
  const [mobileWidth, setMobileWidth] = useState(window.innerWidth < 850);
  useEffect(() => {
    const handleResize = () => {
      setMobileWidth(window.innerWidth < 850);
      setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [open, setOpen] = useState(!mobileWidth);
  const contacts: Contact[] = [
    { name: "Tìm kiếm", slug: "/search" },
    { name: "Giới thiệu", slug: "/pages/about-us" },
    { name: "Chính sách đổi trả", slug: "/pages/chinh-sach-doi-tra" },
    { name: "Chính sách bảo mật", slug: "/pages/chinh-sach-bao-mat" },
    { name: "Tuyển dụng", slug: "/pages/dieu-khoan-dich-vu" },
    { name: "Liên hệ", slug: "/pages/lien-he" },
  ];
  return (
    <Flex
      className="w-full px-3 min850:w-1/4 min-[850px]:pt-[75px] min-[850px]:pr-[15px] min-[850px]:pb-[52px] min-[850px]:pl-[35px] min850:border-r min850:border-b min850:border-[#dedede]"
      vertical
    >
      {mobileWidth && <Divider className="m-0"></Divider>}
      <Flex
        justify="space-between"
        className="w-full py-3 cursor-pointer"
        onClick={() => {
          if (mobileWidth) setOpen(!open);
        }}
      >
        <h2
          className={cn(
            "text-base text-[#d60000]",
            (open || !mobileWidth) && "font-bold"
          )}
        >
          Nhóm liên kết
        </h2>
        <ChevronDown
          size={"1.2rem"}
          className={cn(
            "text-[#d60000] transition-transform duration-1000 block min850:hidden",
            open && "-rotate-180"
          )}
        ></ChevronDown>
      </Flex>
      <AnimatePresence>
        {((open && mobileWidth) || !mobileWidth) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Flex vertical className="pt-2 pb-5 text-[#000000]">
              {contacts.map((item, index) => (
                <li className="text-sm mb-2" key={index}>
                  <Link to={item.slug}>{item.name}</Link>
                </li>
              ))}
              {/* <li className="text-sm mb-2">
                <Link to={"/"}></Link>
              </li> */}
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default GroupLinks;
