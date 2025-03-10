import { useUser } from "@/context/UserContext";
import { Button, Divider, Flex, Form, Input, message, Popover } from "antd";
import { User, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
  email: string;
  password: string;
};

const PopoverUser = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [password, setPassword] = useState("");
  const { user, setUser, handleLogOut, handleLogin } = useUser();
  const navigate = useNavigate();
  const handleLoginButtonClicked = (values: FieldType) => {
    const { email, password } = values;
    const foundUser = handleLogin(email, password);

    if (foundUser) {
      setUser(foundUser);
      message.success("Đăng nhập thành công!");
      setOpen(false);
    } else {
      message.error("Sai tài khoản hoặc mật khẩu!");
    }
  };
  return (
    <>
      <Popover
        trigger="click"
        title={
          <Flex vertical justify="center" className="w-full" align="center">
            {user ? (
              <div className="font-medium text-base">THÔNG TIN TÀI KHOẢN</div>
            ) : (
              <>
                <div className="font-medium text-base">ĐĂNG NHẬP TÀI KHOẢN</div>
                <div className="font-light text-sm mt-1">
                  Nhập email và mật khẩu của bạn:
                </div>
              </>
            )}
            <Divider className="my-3"></Divider>
          </Flex>
        }
        placement={window.innerWidth > 850 ? "bottomLeft" : "bottom"}
        open={open}
        onOpenChange={setOpen}
        content={
          user ? (
            <>
              <div>{user.full_name}</div>
              <Button
                className="w-full mb-6"
                type="text"
                color="primary"
                variant="solid"
                onClick={() => {
                  setOpen(false);
                  message.success("Đăng xuất thành công!");
                  handleLogOut();
                }}
              >
                ĐĂNG XUẤT
              </Button>
            </>
          ) : (
            <div className="w-[95vw] min850:w-[25vw] px-3 min850:h-auto">
              <Form
                form={form}
                autoComplete="off"
                onFinish={handleLoginButtonClicked}
              >
                <Form.Item<FieldType>
                  name="email"
                  validateTrigger={["onSubmit", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      message: (
                        <div className="text-xs">
                          Vui lòng nhập email của bạn
                        </div>
                      ),
                    },
                    {
                      type: "email",
                      message: (
                        <div className="text-xs">Email không hợp lệ!</div>
                      ),
                    },
                  ]}
                >
                  <Input className="h-10" placeholder="Email" allowClear />
                </Form.Item>
                <Form.Item<FieldType>
                  name="password"
                  validateTrigger={["onSubmit", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      message: (
                        <div className="text-xs">Vui lòng nhập mật khẩu</div>
                      ),
                    },
                  ]}
                >
                  <Input.Password
                    allowClear
                    className="h-10"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Input.Password>
                </Form.Item>
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
                  onClick={() => form.submit()}
                >
                  ĐĂNG NHẬP
                </Button>
                <Flex className="text-xs text-[#9e9e9e] mb-2" gap={"0.25rem"}>
                  <div>Khách hàng mới?</div>
                  <Link
                    to="/accounts/register"
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
              </Form>
            </div>
          )
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
