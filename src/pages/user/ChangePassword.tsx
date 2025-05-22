import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import AccountLayout from "@/layouts/Home/AccountLayout";
import { Button, Form, Input, notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { AxiosError } from "axios";

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => userApi.changePassword(data),
    onSuccess: () => {
      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật",
      });
      navigate("/account/profile");
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message: string }>;
      notification.error({
        message: "Đổi mật khẩu thất bại",
        description: axiosError.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSubmit = (values: ChangePasswordData) => {
    changePasswordMutation.mutate(values);
  };

  return (
    <AccountLayout title="Đổi mật khẩu">
      <div className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="current_password"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Xác nhận mật khẩu mới"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp"),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex gap-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={changePasswordMutation.isPending}
            >
              Đổi mật khẩu
            </Button>
            <Button onClick={() => navigate("/account/profile")}>Hủy</Button>
          </div>
        </Form>
      </div>
    </AccountLayout>
  );
};

export default ChangePassword;
