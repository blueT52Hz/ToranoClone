import Contacts from "@/components/Footer/Contacts";
import Copyright from "@/components/Footer/Copyright";
import Fashion from "@/components/Footer/Fashion";
import GroupLinks from "@/components/Footer/GroupLinks";
import Subcribe from "@/components/Footer/Subcribe";
import { Flex } from "antd";
import React, { useEffect, useState } from "react";

interface ItemPolicy {
  title: string;
  content: string;
  img_url: string;
}

const itemsPolicy: ItemPolicy[] = [
  {
    title: "Miễn phí vận chuyển",
    content: "Áp dụng cho mọi đơn hàng từ 500k",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_1.png?v=663",
  },
  {
    title: "Đổi hàng dễ dàng",
    content: "7 ngày đổi hàng vì bất kì lí do gì",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_2.png?v=663",
  },
  {
    title: "HOTLINE 24/7 : 0964942121",
    content: "Hỗ trợ nhanh chóng",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_3.png?v=663",
  },
  {
    title: "Thanh toán đa dạng",
    content: "Thanh toán khi nhận hàng, Napas, Visa, Chuyển Khoản",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_4.png?v=663",
  },
];

const Footer = () => {
  const [mobileWidth, setMobileWidth] = useState(window.innerWidth < 850);
  useEffect(() => {
    const handleResize = () => {
      setMobileWidth(window.innerWidth <= 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <footer className="flex flex-col">
      <section className="policy py-12 border-t border-[#eee]">
        <div className="grid grid-cols-1 min850:grid-cols-2 min1200:grid-cols-4 px-3 mx-14 min850:mx-4 gap-10 min850:gap-6 min1200:gap-0">
          {itemsPolicy.map((item, index) => (
            <div key={index} className="flex justify-start">
              <img
                src={item.img_url}
                alt={item.title}
                className="w-12 h-12 mb-2"
              />
              <div className="flex flex-col pl-4 gap-2">
                <div className="text-base text-shop-color-title font-medium">
                  {item.title}
                </div>
                <div className="text-sm text-gray-500">{item.content}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Flex
        className=" bottom-0 bg-[#f5f5f5] w-full min1200:px-8 flex"
        vertical
      >
        <Flex vertical={mobileWidth} wrap>
          <div className="grid grid-cols-1 min850:grid-cols-2 min1200:grid-cols-4 w-full min850:p-6 min850:gap-1">
            {mobileWidth && <Subcribe></Subcribe>}
            <Fashion></Fashion>
            <Contacts></Contacts>
            <GroupLinks></GroupLinks>
            {!mobileWidth && <Subcribe></Subcribe>}
          </div>
        </Flex>
        <Copyright></Copyright>
      </Flex>
    </footer>
  );
};

export default Footer;
