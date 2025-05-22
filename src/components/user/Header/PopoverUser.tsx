import { authApi } from "@/apis/auth.api";
import { shippingAddressApi } from "@/apis/shippingAddress.api";
import { useAuthStore } from "@/store/authStore";
import { useShippingAddressStore } from "@/store/shippingAddressStrore";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  notification,
  Popover,
} from "antd";
import { AxiosError } from "axios";
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
  const navigate = useNavigate();
  const { user, setUser, logout } = useUserStore();
  const { setToken } = useAuthStore();
  const { setShippingAddresses } = useShippingAddressStore();
  const loginMutation = useMutation({
    mutationFn: (values: FieldType) => authApi.login(values),
  });
  const handleLoginButtonClicked = async (values: FieldType) => {
    const { email, password } = values;
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: async (response) => {
          setOpen(false);
          setUser(response.data.data.user);
          setToken(response.data.data.accessToken);
          try {
            const addressResponse =
              await shippingAddressApi.getShippingAddresses();
            console.log(addressResponse);
            setShippingAddresses(addressResponse.data.data);
          } catch (error) {
            console.error("Error fetching addresses:", error);
          }
          notification.success({
            message: "Đăng nhập thành công",
            description: "Bạn đã đăng nhập thành công",
          });
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<{ message: string }>;
          notification.error({
            message: "Đăng nhập thất bại",
            description: axiosError.response?.data?.message || "Có lỗi xảy ra",
          });
        },
      },
    );
  };

  const handleLogOut = () => {
    logout();
    setToken("");
    notification.success({
      message: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất thành công",
    });
    navigate("/");
  };

  return (
    <>
      <Popover
        trigger="click"
        title={
          <Flex vertical justify="center" className="w-full" align="center">
            {user ? (
              <div className="text-base font-medium">THÔNG TIN TÀI KHOẢN</div>
            ) : (
              <>
                <div className="text-base font-medium">ĐĂNG NHẬP TÀI KHOẢN</div>
                <div className="mt-1 text-sm font-light">
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
            <div className="w-[95vw] px-3 min850:h-auto min850:w-[20vw]">
              <div className="mb-4 text-center text-lg">{user.full_name}</div>
              <ul className="my-4 list-disc space-y-2 pl-8">
                <li>
                  <div
                    className="cursor-pointer text-base"
                    onClick={() => {
                      navigate("/account/profile");
                      setOpen(false);
                    }}
                  >
                    Tài khoản của tôi
                  </div>
                </li>
                <li>
                  <div
                    className="cursor-pointer text-base"
                    onClick={() => {
                      navigate("/account/address");
                      setOpen(false);
                    }}
                  >
                    Danh sách địa chỉ
                  </div>
                </li>
                <li>
                  <div
                    className="cursor-pointer text-base hover:text-red-500"
                    onClick={() => {
                      setOpen(false);
                      handleLogOut();
                    }}
                  >
                    Đăng xuất
                  </div>
                </li>
              </ul>

              {/* <Button
                className="w-full mb-6"
                type="text"
                color="primary"
                variant="solid"
                onClick={() => {
                  setOpen(false);
                  handleLogOut();
                }}
              >
                ĐĂNG XUẤT
              </Button> */}
            </div>
          ) : (
            <div className="w-[95vw] px-3 min850:h-auto min850:w-[25vw]">
              <Form
                form={form}
                autoComplete="off"
                onFinish={handleLoginButtonClicked}
                initialValues={{
                  email: "t1@gmail.com",
                  password: "123456",
                }}
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
                  <Input
                    className="h-10"
                    placeholder="Email"
                    allowClear
                    onPressEnter={() => {
                      form.submit();
                    }}
                  />
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
                    onPressEnter={() => form.submit()}
                  ></Input.Password>
                </Form.Item>
                <div className="mb-6 text-sm text-[#9e9e9e]">
                  This site is protected by reCAPTCHA and the Google{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-cyan-600 hover:text-cyan-600"
                  >
                    Privacy Policy{" "}
                  </a>
                  and{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-cyan-600 hover:text-cyan-600"
                  >
                    Terms of Service
                  </a>{" "}
                  apply.
                </div>
                <Button
                  className="mb-6 w-full"
                  type="text"
                  color="primary"
                  variant="solid"
                  onClick={() => form.submit()}
                >
                  ĐĂNG NHẬP
                </Button>
                <Flex className="mb-2 text-xs text-[#9e9e9e]" gap={"0.25rem"}>
                  <div>Khách hàng mới?</div>
                  <Link
                    to="/accounts/register"
                    className="text-red-600 hover:text-red-600"
                    onClick={() => setOpen(false)}
                  >
                    Tạo tài khoản
                  </Link>
                </Flex>
                <Flex className="mb-3 text-xs text-[#9e9e9e]" gap={"0.25rem"}>
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
