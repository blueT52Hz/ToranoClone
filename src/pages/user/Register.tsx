import { Input, Typography, Form, Radio, DatePicker, notification } from "antd";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth.api";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import dayjs from "dayjs";
import { AxiosError } from "axios";

const sendRegisterWebhook = async (user: User) => {
  try {
    const response = await fetch(
      "https://workflow.proptit.com/webhook/470d7d94-4b32-49b3-a716-9e5620711391",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          fullName: user.full_name,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send register webhook notification");
    }
  } catch (error) {
    console.error("Error sending register webhook notification:", error);
  }
};

interface FormValues {
  lastName: string;
  firstName: string;
  gender: "Nam" | "Nữ" | "Khác";
  dob: Date;
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  gender: "Nam" | "Nữ" | "Khác";
  date_of_birth: string;
  email: string;
  password: string;
}

const { Text } = Typography;

const Register = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const { setUser } = useUserStore();
  const { setToken } = useAuthStore();
  const registerMutation = useMutation({
    mutationFn: (user: RegisterData) => authApi.register(user),
  });

  const onFinish = (values: FormValues) => {
    const { lastName, firstName, gender, dob, email, password } = values;
    const registerData: RegisterData = {
      full_name: firstName + " " + lastName,
      gender,
      date_of_birth: format(dob, "yyyy-MM-dd"),
      email,
      password,
    };
    registerMutation.mutate(registerData, {
      onSuccess: (response) => {
        console.log(response);
        setUser(response.data.data.user);
        setToken(response.data.data.accessToken);
        sendRegisterWebhook(response.data.data.user);
        navigate("/");
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError<{ message: string }>;
        notification.error({
          message: "Đăng ký thất bại",
          description: axiosError.response?.data?.message || "Có lỗi xảy ra",
        });
      },
    });
  };

  return (
    <section className="login-section flex items-center justify-center">
      <div className="rounded-lg p-8">
        <div className="mb-8 flex justify-center">
          <button
            className={cn(
              "px-4 text-2xl font-bold transition-all duration-300",
              "text-gray-400 hover:text-[#000]",
            )}
            onClick={() => navigate("/accounts/login")}
          >
            Đăng nhập
          </button>
          <span className="px-2 text-gray-300">|</span>
          <div
            className={cn(
              "px-4 text-2xl font-bold transition-all duration-300",
              "text-[#000]",
            )}
          >
            Đăng ký
          </div>
        </div>

        <div className="">
          <Form
            form={form}
            autoComplete="off"
            onFinish={onFinish}
            initialValues={{
              firstName: "Nguyễn",
              lastName: "Văn A",
              gender: "Nam",
              dob: dayjs("2000-01-01"),
              email: "test@gmail.com",
              password: "123456",
              confirmPassword: "123456",
            }}
          >
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Vui lòng nhập họ" }]}
            >
              <Input
                size="large"
                placeholder="Họ"
                className="bg-gray-200 italic"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input
                size="large"
                placeholder="Tên"
                className="bg-gray-200 italic"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Radio.Group>
                <Radio value="Nữ">Nữ</Radio>
                <Radio value="Nam">Nam</Radio>
                <Radio value="Khác">Khác</Radio>
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
                className="w-full bg-gray-200 italic"
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
                className="bg-gray-200 italic"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                size="large"
                placeholder="Mật khẩu"
                className="bg-gray-200 italic"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Xác nhận mật khẩu"
                className="bg-gray-200 italic"
              />
            </Form.Item>

            <Text type="secondary" className="mb-2 block text-xs">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
                className="text-blue-500"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                className="text-blue-500"
                target="_blank"
                rel="noopener"
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
                ĐĂNG KÝ
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <span>Bạn đã có tài khoản? </span>
                <div
                  className="cursor-pointer text-blue-500"
                  onClick={() => {
                    navigate("/accounts/login");
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
