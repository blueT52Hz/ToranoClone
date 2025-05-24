import { Form, Input, Button, notification, Select } from "antd";
import type { ShippingAddress } from "@/types/user.type";
import { shippingAddressApi } from "@/apis/user/shippingAddress.api";
import { useShippingAddressStore } from "@/store/user/shippingAddressStrore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

interface AddressFormProps {
  existingAddress: ShippingAddress | null;
  onClose: () => void;
}

type AddressFormData = Omit<
  ShippingAddress,
  "user_id" | "address_id" | "created_at" | "updated_at"
>;

interface LocationData {
  id: string;
  full_name: string;
}

const AddressForm = ({ existingAddress, onClose }: AddressFormProps) => {
  const [form] = Form.useForm();
  const { setShippingAddresses } = useShippingAddressStore();
  const [provinces, setProvinces] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<LocationData[]>([]);
  const [wards, setWards] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    setLoading(true);
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách tỉnh/thành phố",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch districts when province is selected
  const handleProvinceChange = (provinceId: string) => {
    setLoading(true);
    form.setFieldsValue({ district: undefined, ward: undefined });
    fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setDistricts(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách quận/huyện",
        });
      })
      .finally(() => setLoading(false));
  };

  // Fetch wards when district is selected
  const handleDistrictChange = (districtId: string) => {
    setLoading(true);
    form.setFieldsValue({ ward: undefined });
    fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setWards(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách phường/xã",
        });
      })
      .finally(() => setLoading(false));
  };

  const addMutation = useMutation({
    mutationFn: (data: AddressFormData) =>
      shippingAddressApi.addShippingAddress(data),
    onSuccess: async () => {
      notification.success({
        message: "Thêm địa chỉ thành công",
      });
      const response = await shippingAddressApi.getShippingAddresses();
      setShippingAddresses(response.data.data);
      onClose();
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message: string }>;
      notification.error({
        message: "Thêm địa chỉ thất bại",
        description: axiosError.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { addressId: string; body: AddressFormData }) =>
      shippingAddressApi.updateShippingAddress(data.addressId, data.body),
    onSuccess: async () => {
      notification.success({
        message: "Cập nhật địa chỉ thành công",
      });
      const response = await shippingAddressApi.getShippingAddresses();
      setShippingAddresses(response.data.data);
      onClose();
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message: string }>;
      notification.error({
        message: "Cập nhật địa chỉ thất bại",
        description: axiosError.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  const onFinish = (values: AddressFormData) => {
    const selectedProvince = provinces.find((p) => p.id === values.city);
    const selectedDistrict = districts.find((d) => d.id === values.district);
    const selectedWard = wards.find((w) => w.id === values.ward);

    const formattedValues = {
      ...values,
      city: selectedProvince?.full_name || "",
      district: selectedDistrict?.full_name || "",
      ward: selectedWard?.full_name || "",
    };

    if (existingAddress) {
      updateMutation.mutate({
        addressId: existingAddress.address_id,
        body: formattedValues,
      });
    } else {
      addMutation.mutate(formattedValues);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={existingAddress || {}}
      className="rounded-lg bg-white p-6 shadow-md"
    >
      <Form.Item
        name="full_name"
        label="Họ và tên"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
      >
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item
        name="phone_number"
        label="Số điện thoại"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại" },
          {
            pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
            message: "Số điện thoại không hợp lệ",
          },
        ]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        name="city"
        label="Tỉnh/Thành phố"
        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
      >
        <Select
          placeholder="Chọn tỉnh/thành phố"
          options={provinces.map((province) => ({
            value: province.id,
            label: province.full_name,
          }))}
          onChange={handleProvinceChange}
          loading={loading}
        />
      </Form.Item>

      <Form.Item
        name="district"
        label="Quận/Huyện"
        rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
      >
        <Select
          placeholder="Chọn quận/huyện"
          options={districts.map((district) => ({
            value: district.id,
            label: district.full_name,
          }))}
          onChange={handleDistrictChange}
          loading={loading}
          disabled={!form.getFieldValue("city")}
        />
      </Form.Item>

      <Form.Item
        name="ward"
        label="Phường/Xã"
        rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
      >
        <Select
          placeholder="Chọn phường/xã"
          options={wards.map((ward) => ({
            value: ward.id,
            label: ward.full_name,
          }))}
          loading={loading}
          disabled={!form.getFieldValue("district")}
        />
      </Form.Item>

      <Form.Item
        name="address_detail"
        label="Địa chỉ cụ thể"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
      >
        <Input.TextArea rows={3} placeholder="Nhập số nhà, tên đường..." />
      </Form.Item>

      <div className="flex justify-end gap-4">
        <Button onClick={onClose}>Hủy</Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={addMutation.isPending || updateMutation.isPending}
        >
          {existingAddress ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </Form>
  );
};

export default AddressForm;
