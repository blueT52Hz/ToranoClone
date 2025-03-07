import { Button, Divider, Flex, Input, Popover } from "antd";
import { User, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const PopoverUser = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Popover
        trigger="click"
        title={
          <Flex vertical justify="center" className="w-full" align="center">
            <div className="font-medium text-base">ĐĂNG NHẬP TÀI KHOẢN</div>
            <div className="font-light text-sm mt-1">
              Nhập email và mật khẩu của bạn:
            </div>
            <Divider className="my-3"></Divider>
          </Flex>
        }
        placement={window.innerWidth > 850 ? "bottomLeft" : "bottom"}
        open={open}
        onOpenChange={setOpen}
        content={
          <div className="w-[95vw] min850:w-[25vw] px-3 min850:h-auto">
            <Input className="mb-6 h-10" placeholder="Email" allowClear></Input>
            <Input.Password
              allowClear
              className="mb-3 h-10"
              placeholder="Mật khẩu"
            ></Input.Password>
            <div className="text-sm text-[#9e9e9e] mb-6">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-600 hover:text-cyan-600"
              >
                Privacy Policy{" "}
              </a>
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-600 hover:text-cyan-600"
              >
                Terms of Service
              </a>{" "}
              apply.
            </div>
            <Button
              className="w-full mb-6"
              type="text"
              color="primary"
              variant="solid"
            >
              ĐĂNG NHẬP
            </Button>
            <Flex className="text-xs text-[#9e9e9e] mb-2" gap={"0.25rem"}>
              <div>Khách hàng mới?</div>
              <Link
                to="/login"
                className="text-red-600 hover:text-red-600"
                onClick={() => setOpen(false)}
              >
                Tạo tài khoản
              </Link>
            </Flex>
            <Flex className="text-xs text-[#9e9e9e] mb-3" gap={"0.25rem"}>
              <div>Quên mật khẩu?</div>
              <Link
                to="/"
                className="text-red-600 hover:text-red-600"
                onClick={() => setOpen(false)}
              >
                Khôi phục mật khẩu
              </Link>
            </Flex>
          </div>
        }
      >
        {!open ? (
          <User
            className="cursor-pointer"
            onClick={() => setOpen(true)}
            size={"1.5rem"}
          ></User>
        ) : (
          <X
            className="cursor-pointer"
            onClick={() => setOpen(false)}
            size={"1.5rem"}
          ></X>
        )}
      </Popover>
    </>
  );
};

export default PopoverUser;
