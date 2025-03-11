import { Badge, Button, Flex, Popover, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { cn } from "@/utils/cn";

const TopBar = () => {
  const [show, setShow] = useState<boolean>(true);

  const handleClick = () => {
    setShow(false);
  };

  return (
    <div>
      {/* Banner */}
      <div className={cn("relative w-full", show ? "block" : "hidden")}>
        <Link
          to={"/collections/onsale"}
          className="flex justify-center bg-black"
        >
          <img
            src="//theme.hstatic.net/200000690725/1001078549/14/topbar_img.jpg?v=647"
            alt="Sale"
          />
        </Link>
        <Button
          type="default"
          shape="circle"
          size="middle"
          icon={<CloseOutlined />}
          onClick={handleClick}
          className="absolute top-1 right-1 md:top-2 md:right-2 opacity-40"
        />
      </div>

      {/* TopBar */}
      <div className="px-12 bg-[#242021] text-[13px] text-white w-full hidden md:block">
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
            {/* Liên hệ */}
            <div className="contact ml-4 pl-4 relative before:content-['|'] before:absolute before:h-[80%] before:w-px before:top-0 before:bottom-0 before:m-auto before:left-0 before:text-white/40">
              <Link to={"/"} className="hover:text-white">
                Liên hệ
              </Link>
            </div>
          </Flex>
          <Popover
            title={"Thông báo"}
            placement="bottom"
            content={
              <div className="notification-container min-w-96 text-sm">
                {Array.from({ length: 5 }).map((_, i) => {
                  return <div key={i}>Thông báo {i + 1}</div>;
                })}
              </div>
            }
            color="#FFFDF0"
          >
            <Flex align="center" className="cursor-pointer">
              <Badge count={5} size="small" showZero>
                <Bell className="text-white w-5 h-5" />
              </Badge>
              <span className="ml-3">Thông báo của tôi</span>
            </Flex>
          </Popover>
        </Flex>
      </div>
    </div>
  );
};

export default TopBar;
