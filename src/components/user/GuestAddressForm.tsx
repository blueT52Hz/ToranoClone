import { Form, Input, Button, notification, Select } from "antd";
import type { ShippingAddress } from "@/types/user";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

interface GuestAddressFormProps {
  onAddressSaved: (address: ShippingAddress) => void;
}

interface LocationData {
  id: string;
  full_name: string;
}

const GuestAddressForm = ({ onAddressSaved }: GuestAddressFormProps) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<LocationData[]>([]);
  const [wards, setWards] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const onFinish = (values: {
    full_name: string;
    phone_number: string;
    address_detail: string;
    city: string;
    district: string;
    ward: string;
    country: string;
  }) => {
    const selectedProvince = provinces.find((p) => p.id === values.city);
    const selectedDistrict = districts.find((d) => d.id === values.district);
    const selectedWard = wards.find((w) => w.id === values.ward);

    const guestAddress: ShippingAddress = {
      address_id: uuidv4(),
      user_id: "guest",
      full_name: values.full_name,
      phone_number: values.phone_number,
      address_detail: values.address_detail,
      city: selectedProvince?.full_name || "",
      district: selectedDistrict?.full_name || "",
      ward: selectedWard?.full_name || "",
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAddressSaved(guestAddress);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const values = form.getFieldsValue();
    const selectedProvince = provinces.find((p) => p.id === values.city);
    const selectedDistrict = districts.find((d) => d.id === values.district);
    const selectedWard = wards.find((w) => w.id === values.ward);

    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Địa chỉ đã được thêm thành công
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-gray-200 bg-white p-4">
          <div className="font-medium">{values.full_name}</div>
          <div className="text-gray-600">{values.phone_number}</div>
          <div className="mt-1 text-gray-600">
            {values.address_detail}, {selectedWard?.full_name},{" "}
            {selectedDistrict?.full_name}, {selectedProvince?.full_name}, Việt
            Nam
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <p className="mb-4 text-gray-600">
        Vui lòng nhập thông tin giao hàng của bạn:
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ country: "Việt Nam" }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Form.Item
            name="city"
            label="Tỉnh/Thành phố"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
            ]}
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
        </div>

        <Form.Item
          name="address_detail"
          label="Địa chỉ cụ thể"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập số nhà, tên đường..." />
        </Form.Item>

        <Form.Item name="country" label="Quốc gia">
          <Input disabled />
        </Form.Item>

        <div className="flex justify-end pt-4">
          <Button type="primary" htmlType="submit">
            Sử dụng địa chỉ này
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default GuestAddressForm;
