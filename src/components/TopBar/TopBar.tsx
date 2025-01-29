import { Button, Flex } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const TopBar = () => {
  const [show, setShow] = useState<boolean>(true);

  const handleClick = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div>
      {/* Banner */}
      <div className="flex-col relative">
        <Link to={"/collections/onsale"}>
          <picture className="w-full">
            <img
              src="//theme.hstatic.net/200000690725/1001078549/14/topbar_img.jpg?v=647"
              alt="Sale"
            />
          </picture>
        </Link>
        <Button
          type="default"
          shape="circle"
          icon={<CloseOutlined />}
          onClick={handleClick}
          className="absolute top-2 right-2 opacity-40"
        />
      </div>

      {/* TopBar */}
      <div className="px-12 bg-[#242021] text-[13px] text-white">
        <Flex className="py-2 justify-between">
          {/* Hotline */}
          <Flex className="hotline">
            <span className="whitespace-pre">
              Hotline mua hàng:{" "}
              <a
                href="tel:0964942121"
                className="font-bold no-underline decoration-[initial] hover:text-white"
              >
                0964942121
              </a>{" "}
              (8:30-21:30, Tất cả các ngày trong tuần)
            </span>
          </Flex>

          {/* Liên hệ */}
          <div className="contact ml-4 pl-4 relative before:content-['|'] before:absolute before:h-[80%] before:w-px before:top-0 before:bottom-0 before:m-auto before:left-0 before:text-white/40">
            <Link to={"/"} className="hover:text-white">
              Liên hệ
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default TopBar;
