import { cn } from "@/utils/cn";
import { Divider, Flex } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

const Contacts = () => {
  const [mobileWidth, setMobileWidth] = useState(window.innerWidth < 850);
  useEffect(() => {
    setMobileWidth(window.innerWidth < 850);
    setOpen(!mobileWidth);
  }, [window.innerWidth]);
  const [open, setOpen] = useState(!mobileWidth);
  const imgageUrls = [
    "https://theme.hstatic.net/200000690725/1001078549/14/shipment_1_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/shipment_2_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/shipment_3_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/shipment_4_img.png?v=647",
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
          Thông tin liên hệ
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
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Flex vertical className="pt-3 pb-5">
              <p className="mb-2 text-sm">
                <b>Địa chỉ:</b> Tầng 8, tòa nhà Ford, số 313 Trường Chinh, quận
                Thanh Xuân, Hà Nội
              </p>
              <p className="mb-2 text-sm">
                <b>Điện thoại:</b> 0964942121
              </p>
              <p className="mb-2 text-sm">
                <b>Fax:</b> 0904636356
              </p>
              <p className="mb-2 text-sm">
                <b>Email:</b> cskh@torano.vn
              </p>

              <div className="mt-3 font-bold text-base">
                Phương thức vận chuyển
              </div>
              <Flex wrap className="mt-3" gap={"0.5rem"}>
                {imgageUrls.map((item) => {
                  return (
                    <div className="border border-slate-300 overflow-hidden rounded-md w-14 h-12">
                      <img src={item} alt="" className="w-auto h-auto" />
                    </div>
                  );
                })}
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default Contacts;
