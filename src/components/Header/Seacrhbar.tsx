import { Button, Divider, Drawer, Flex, Input, Modal, Popover } from "antd";
import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import "@components/Header/style.css";
import { Link } from "react-router-dom";

const Searchbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(false);
  useEffect(() => {
    setMobileWidth(window.innerWidth < 850);
  }, [window.innerWidth]);
  return (
    <>
      {!mobileWidth && (
        <Search
          onClick={() => setOpen(true)}
          className="cursor-pointer"
          size={"1.5rem"}
        />
      )}
      {!mobileWidth ? (
        <Drawer
          placement={window.innerWidth > 850 ? "top" : "top"}
          title={null}
          open={open && !mobileWidth}
          onClose={() => setOpen(false)}
          closeIcon={null}
          height={"10rem"}
        >
          <div className="min850:px-12 px-6 h-full">
            <Flex className="relative h-full py-6" justify="space-between">
              {/* Logo */}
              <div className="bg-white min-w-36 max-w-52 px-4">
                <Link to="/">
                  <img
                    src="https://theme.hstatic.net/200000690725/1001078549/14/logo.png?v=647"
                    alt="logo"
                  />
                </Link>
              </div>
              <Flex vertical justify="center" align="center">
                <Input.Search
                  placeholder="Tìm kiếm ..."
                  size="large"
                  className="w-[40rem]"
                  allowClear
                ></Input.Search>
                <div className="mt-2 text-base">
                  Polo, Short Đũi, TShirt, . . .
                </div>
              </Flex>
              <X
                size={"2rem"}
                className=" text-slate-500 cursor-pointer top-0 right-0"
                onClick={() => setOpen(false)}
              />
            </Flex>
          </div>
        </Drawer>
      ) : (
        <Popover
          open={open && mobileWidth}
          placement="bottom"
          title={null}
          content={
            <div className="w-[95vw] min850:w-[25vw] px-3 h-[90vh] flex-col">
              <div className="font-bold text-xl text-center">TÌM KIẾM</div>
              <Divider className="my-2"></Divider>
              <Input.Search
                placeholder="Tìm kiếm sản phẩm ..."
                allowClear
                size="large"
                className="mt-4"
              ></Input.Search>
              <div className="text-base mt-2 text-center">
                Polo, Short Đũi, TShirt, . . .
              </div>
            </div>
          }
        >
          {open ? (
            <X
              onClick={() => setOpen(false)}
              className="cursor-pointer"
              size={"1.5rem"}
            />
          ) : (
            <Search
              onClick={() => setOpen(true)}
              className="cursor-pointer"
              size={"1.5rem"}
            />
          )}
        </Popover>
      )}
    </>
  );
};

export default Searchbar;
