import React, { useState } from "react";
import { Input, Typography, Form, Radio, DatePicker } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";

const { Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  return (
    <section className="login-section flex items-center justify-center">
      <div className=" rounded-lg p-8 ">
        <div className="flex justify-center mb-8">
          <button
            className={cn(
              "text-2xl font-bold px-4 transition-all duration-300",
              "text-gray-400 hover:text-[#000]"
            )}
            onClick={() => navigate("/accounts/login")}
          >
            Đăng nhập
          </button>
          <span className="px-2 text-gray-300">|</span>
          <div
            className={cn(
              "text-2xl font-bold px-4 transition-all duration-300",
              "text-[#000]"
            )}
          >
            Đăng ký
          </div>
        </div>

        <div className="">
          <Form form={form} autoComplete="off">
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Vui lòng nhập họ" }]}
            >
              <Input
                size="large"
                placeholder="Họ"
                className="italic bg-gray-200"
              />
            </Form.Item>

            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input
                size="large"
                placeholder="Tên"
                className="italic bg-gray-200"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Radio.Group>
                <Radio value="female">Nữ</Radio>
                <Radio value="male">Nam</Radio>
                <Radio value="other">Khác</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="dob"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker
                size="large"
                placeholder="mm/dd/yyyy"
                format="MM/DD/YYYY"
                className="w-full italic bg-gray-200"
              />
            </Form.Item>

            <Form.Item
              name="email"
              validateTrigger={["onSubmit", "onBlur"]}
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                size="large"
                placeholder="Email"
                className="italic bg-gray-200"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                size="large"
                placeholder="Mật khẩu"
                className="italic bg-gray-200"
              />
            </Form.Item>

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
                ĐĂNG KÝ
              </div>
              <div className="text-sm text-gray-600 flex flex-col gap-2">
                <span>Bạn đã có tài khoản? </span>
                <div
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Đăng nhập
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Register;
