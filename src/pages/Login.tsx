import React, { useState } from "react";
import { Input, Button, Typography, Divider } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "forget">("login");

  return (
    <section className="login-section flex items-center justify-center">
      <div className=" rounded-lg p-8 ">
        <div className="flex justify-center pb-2">
          <button
            className={`text-lg font-bold px-4 ${
              activeTab === "login" ? "text-black " : "text-gray-400"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Đăng nhập
          </button>
          <span className="px-2 text-gray-300">|</span>
          <button
            className={`text-lg font-bold px-4 ${
              activeTab === "forget"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("forget")}
          >
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <div className="mt-6">
          <Input
            allowClear
            type="email"
            placeholder="Vui lòng nhập email của bạn"
            className="mb-4"
            size="large"
          />
          <Input.Password
            allowClear
            placeholder="Vui lòng nhập mật khẩu"
            className="mb-4"
            size="large"
          />

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
            <div className="cursor-pointer">ĐĂNG NHẬP</div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-600 flex gap-2">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-500">
                  Đăng ký
                </Link>
              </div>
              <div className="text-sm text-gray-600 flex gap-2">
                Bạn quên mật khẩu?{" "}
                <a href="#" className="text-blue-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
