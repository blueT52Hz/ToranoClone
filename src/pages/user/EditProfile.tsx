import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import AccountLayout from "@/layouts/Home/AccountLayout";
import { Button, DatePicker, Form, Input, Select, notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import dayjs from "dayjs";
import { AxiosError } from "axios";
import { AuthResponse } from "@/types/auth.type";
interface FormData {
  full_name: string;
  gender: "Nam" | "Nữ" | "Khác";
  date_of_birth: string;
}

const EditProfile = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData) => userApi.updateProfile(data),
    onSuccess: (response) => {
      setUser(response.data.data.user);
      console.log(response.data);
      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
      navigate("/account/profile");
    },
    onError: (error: unknown) => {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;
      notification.error({
        message: "Cập nhật thất bại",
        description: axiosError.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSubmit = (values: FormData) => {
    updateProfileMutation.mutate(values);
  };

  return (
    <AccountLayout title="Chỉnh sửa thông tin">
      <div className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            full_name: user.full_name,
            gender: user.gender,
            date_of_birth: dayjs(user.date_of_birth),
          }}
        >
          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date_of_birth"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <div className="flex gap-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={updateProfileMutation.isPending}
            >
              Lưu thay đổi
            </Button>
            <Button onClick={() => navigate("/account/profile")}>Hủy</Button>
          </div>
        </Form>
      </div>
    </AccountLayout>
  );
};

export default EditProfile;
