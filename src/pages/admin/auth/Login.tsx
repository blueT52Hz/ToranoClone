import { Button, Form, Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/admin/auth.api";
import { useAdminAuthStore } from "@/store/admin/authStore";
interface LoginForm {
  admin_username: string;
  admin_password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAdminToken } = useAdminAuthStore();
  const [form] = Form.useForm();
  const loginMutation = useMutation({
    mutationFn: (values: LoginForm) => authApi.login(values),
  });

  const onFinish = (values: LoginForm) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        setAdminToken(data.data.data.accessToken);
        notification.success({
          message: "Đăng nhập thành công",
        });
        navigate("/admin/dashboard");
      },
      onError: (error) => {
        console.log(error);
        notification.error({
          message: "Đăng nhập thất bại",
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Đăng nhập Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng đăng nhập để truy cập trang quản trị
          </p>
        </div>

        <Form
          form={form}
          name="admin_login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-md"
          initialValues={{
            admin_username: "admin",
            admin_password: "admin123",
          }}
        >
          <Form.Item
            name="admin_username"
            rules={[
              { required: true, message: "Vui lòng nhập tên tài khoản!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tên tài khoản"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="admin_password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
