import React, { useState } from "react";
import { Input, Button, Typography, Divider, Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useUser } from "@/context/UserContext";
import { mockUsers, User } from "@/types/user";
import axios from "axios";
import axiosClient from "@/api/axiosClient";

const { Text } = Typography;

type FieldType = {
  email: string;
  password: string;
};

const Login = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [form] = Form.useForm();
  const { user, setUser, handleLogin } = useUser();
  const navigate = useNavigate();
  if (user) navigate("/");

  const handleLoginButtonClicked = async (values: FieldType) => {
    const { email, password } = values;
    await handleLogin(email, password);
  };

  return (
    <section className="login-section flex items-center justify-center my-24">
      <div className=" rounded-lg p-8 ">
        <div className="flex justify-center mb-8">
          <div
            className={cn(
              "text-2xl font-bold px-4 transition-all duration-300",
              isLoginTab
                ? "text-black"
                : "text-gray-400 hover:text-[#000] cursor-pointer"
            )}
            onClick={() => setIsLoginTab(true)}
          >
            Đăng nhập
          </div>
          <span className="px-2 text-gray-300">|</span>
          <Link
            to={"/accounts/register"}
            className={cn(
              "text-2xl font-bold px-4 transition-all duration-300",
              "text-gray-400 hover:text-[#000]"
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

            <Text type="secondary" className="text-xs block mb-2">
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
            <div className="flex justify-center gap-8 mt-8 items-center">
              <div
                className="cursor-pointer hover:text-shop-color-button-text text-[#000] font-semibold text-base px-4"
                onClick={() => form.submit()}
              >
                ĐĂNG NHẬP
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-600 flex gap-2">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/register" className="text-blue-500">
                    Đăng ký
                  </Link>
                </div>
                <div className="text-sm text-gray-600 flex gap-2">
                  {isLoginTab ? (
                    <>
                      <span>Bạn quên mật khẩu? </span>
                      <div
                        className="text-blue-500 cursor-pointer"
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
                        className="text-blue-500 cursor-pointer"
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
