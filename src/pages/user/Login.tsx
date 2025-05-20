import React, { useState } from "react";
import { Input, Typography, Form, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth.api";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { AxiosError } from "axios";
const { Text } = Typography;

type FieldType = {
  email: string;
  password: string;
};

const Login = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const loginMutation = useMutation({
    mutationFn: (values: FieldType) => authApi.login(values),
  });

  const handleLoginButtonClicked = async (values: FieldType) => {
    const { email, password } = values;
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          console.log(response);
          setToken(response.data.data.accessToken);
          setUser(response.data.data.user);
          notification.success({
            message: "Đăng nhập thành công",
            description: "Bạn đã đăng nhập thành công",
          });
          navigate("/");
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

  return (
    <section className="login-section my-24 flex items-center justify-center">
      <div className="rounded-lg p-8">
        <div className="mb-8 flex justify-center">
          <div
            className={cn(
              "px-4 text-2xl font-bold transition-all duration-300",
              isLoginTab
                ? "text-black"
                : "cursor-pointer text-gray-400 hover:text-[#000]",
            )}
            onClick={() => setIsLoginTab(true)}
          >
            Đăng nhập
          </div>
          <span className="px-2 text-gray-300">|</span>
          <Link
            to={"/accounts/register"}
            className={cn(
              "px-4 text-2xl font-bold transition-all duration-300",
              "text-gray-400 hover:text-[#000]",
            )}
            onClick={() => setIsLoginTab(false)}
          >
            Đăng ký
          </Link>
        </div>

        <div className="">
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
                    <div className="text-xs">Vui lòng nhập email của bạn</div>
                  ),
                },
                {
                  type: "email",
                  message: <div className="text-xs">Email không hợp lệ!</div>,
                },
              ]}
              className="mb-6"
            >
              <Input
                size="large"
                allowClear
                type="email"
                autoComplete={"off"}
                placeholder="Vui lòng nhập email của bạn"
                className="bg-gray-200 italic"
              />
            </Form.Item>
            {isLoginTab && (
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
                className="mb-6"
              >
                <Input.Password
                  allowClear
                  autoComplete={"off"}
                  placeholder="Vui lòng nhập mật khẩu"
                  size="large"
                  className="bg-gray-200 italic"
                />
              </Form.Item>
            )}

            <Text type="secondary" className="mb-2 block text-xs">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                className="text-blue-500"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                className="text-blue-500"
                target="_blank"
              >
                Terms of Service
              </a>{" "}
              apply.
            </Text>
            <div className="mt-8 flex items-center justify-center gap-8">
              <div
                className="cursor-pointer px-4 text-base font-semibold text-[#000] hover:text-shop-color-button-text"
                onClick={() => form.submit()}
              >
                ĐĂNG NHẬP
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 text-sm text-gray-600">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/register" className="text-blue-500">
                    Đăng ký
                  </Link>
                </div>
                <div className="flex gap-2 text-sm text-gray-600">
                  {isLoginTab ? (
                    <>
                      <span>Bạn quên mật khẩu? </span>
                      <div
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          form.resetFields();
                          setIsLoginTab(false);
                        }}
                      >
                        Quên mật khẩu?
                      </div>
                    </>
                  ) : (
                    <>
                      <span>Bạn đã có tài khoản? </span>
                      <div
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          form.resetFields();
                          setIsLoginTab(true);
                        }}
                      >
                        Đăng nhập
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
