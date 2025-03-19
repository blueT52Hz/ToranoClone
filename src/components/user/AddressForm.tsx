import React, { useState, useEffect } from "react";
import { Province, District, Ward, ShippingAddress } from "@/types/user";
import { useUser } from "@/context/UserContext";

interface AddressFormProps {
  existingAddress?: ShippingAddress | null;
  onClose: () => void;
  onAddressAdded?: (address: ShippingAddress) => void;
  setAddressState: React.Dispatch<React.SetStateAction<ShippingAddress[]>>;
}

const AddressForm: React.FC<AddressFormProps> = ({
  existingAddress,
  onClose,
  onAddressAdded,
  setAddressState,
}) => {
  console.log(existingAddress);

  const { addAddress, updateAddress } = useUser();

  const [formData, setFormData] = useState({
    full_name: existingAddress?.full_name || "",
    phone_number: existingAddress?.phone_number || "",
    address_detail: existingAddress?.address_detail || "",
    // country: existingAddress?.country || "Việt Nam",
    is_default: existingAddress?.is_default || false,
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");

  const [provinceLabel, setProvinceLabel] = useState<string>("");
  const [districtLabel, setDistrictLabel] = useState<string>("");
  const [wardLabel, setWardLabel] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setSelectedProvince(existingAddress?.city || "");
    setSelectedDistrict(existingAddress?.district || "");
    setSelectedWard(existingAddress?.ward || "");
  }, [existingAddress]);

  // Fetch provinces on mount
  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data);

          // If editing address, find the province id
          if (existingAddress) {
            const provinceMatch = data.data.find(
              (p: Province) => p.full_name === existingAddress.city
            );
            if (provinceMatch) {
              setSelectedProvince(provinceMatch.id);
              setProvinceLabel(provinceMatch.full_name);
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setErrors((prev) => ({
          ...prev,
          general: "Không thể tải danh sách tỉnh/thành phố",
        }));
      });
  }, [existingAddress]);

  // Fetch districts when province is selected
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setDistricts(data.data);

            // If editing address, find the district id
            if (existingAddress) {
              const districtMatch = data.data.find(
                (d: District) => d.full_name === existingAddress.district
              );
              if (districtMatch) {
                setSelectedDistrict(districtMatch.id);
                setDistrictLabel(districtMatch.full_name);
              }
            } else {
              setSelectedDistrict("");
              setWards([]);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
          setErrors((prev) => ({
            ...prev,
            general: "Không thể tải danh sách quận/huyện",
          }));
        });
    }
  }, [selectedProvince, existingAddress]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setWards(data.data);

            // If editing address, find the ward id
            if (existingAddress) {
              const wardMatch = data.data.find(
                (w: Ward) => w.full_name === existingAddress.ward
              );
              if (wardMatch) {
                setSelectedWard(wardMatch.id);
                setWardLabel(wardMatch.full_name);
              }
            } else {
              setSelectedWard("");
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
          setErrors((prev) => ({
            ...prev,
            general: "Không thể tải danh sách phường/xã",
          }));
        });
    }
  }, [selectedDistrict, existingAddress]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "full_name":
        return !value.trim() ? "Vui lòng nhập họ tên" : "";
      case "phone_number":
        if (!value.trim()) return "Vui lòng nhập số điện thoại";
        if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(value)) {
          return "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng";
        }
        return "";
      case "address_detail":
        return !value.trim() ? "Vui lòng nhập địa chỉ chi tiết" : "";
      case "province":
        return !value ? "Vui lòng chọn tỉnh/thành phố" : "";
      case "district":
        return !value ? "Vui lòng chọn quận/huyện" : "";
      case "ward":
        return !value ? "Vui lòng chọn phường/xã" : "";
      default:
        return "";
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);

    const selectedProv = provinces.find((p) => p.id === provinceId);
    if (selectedProv) {
      setProvinceLabel(selectedProv.full_name);
    }

    // Reset district and ward when province changes
    setSelectedDistrict("");
    setSelectedWard("");

    // Validate
    const error = validateField("province", provinceId);
    if (error) {
      setErrors((prev) => ({ ...prev, province: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.province;
        return newErrors;
      });
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);

    const selectedDist = districts.find((d) => d.id === districtId);
    if (selectedDist) {
      setDistrictLabel(selectedDist.full_name);
    }

    // Reset ward when district changes
    setSelectedWard("");

    // Validate
    const error = validateField("district", districtId);
    if (error) {
      setErrors((prev) => ({ ...prev, district: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.district;
        return newErrors;
      });
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = e.target.value;
    setSelectedWard(wardId);

    const selectedW = wards.find((w) => w.id === wardId);
    if (selectedW) {
      setWardLabel(selectedW.full_name);
    }

    // Validate
    const error = validateField("ward", wardId);
    if (error) {
      setErrors((prev) => ({ ...prev, ward: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.ward;
        return newErrors;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    const fullNameError = validateField("full_name", formData.full_name);
    if (fullNameError) newErrors.full_name = fullNameError;

    const phoneError = validateField("phone_number", formData.phone_number);
    if (phoneError) newErrors.phone_number = phoneError;

    const addressError = validateField(
      "address_detail",
      formData.address_detail
    );
    if (addressError) newErrors.address_detail = addressError;

    const provinceError = validateField("province", selectedProvince);
    if (provinceError) newErrors.province = provinceError;

    const districtError = validateField("district", selectedDistrict);
    if (districtError) newErrors.district = districtError;

    const wardError = validateField("ward", selectedWard);
    if (wardError) newErrors.ward = wardError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let updatedAddress;

      if (existingAddress) {
        // Update existing address
        updatedAddress = {
          ...existingAddress,
          ...formData,
          city: provinceLabel,
          district: districtLabel,
          ward: wardLabel,
          updated_at: new Date(),
        };
        await updateAddress(updatedAddress);
      } else {
        updatedAddress = await addAddress({
          ...formData,
          city: provinceLabel,
          district: districtLabel,
          ward: wardLabel,
        });
      }

      // Callback if provided
      if (onAddressAdded) {
        onAddressAdded(updatedAddress);
      }

      if (updatedAddress.is_default) {
        setAddressState((prev) =>
          prev.map((addr) => ({
            ...addr,
            is_default: addr.address_id === updatedAddress.address_id,
          }))
        );
      }
      setAddressState((prev) =>
        prev.map((addr) =>
          addr.address_id === updatedAddress.address_id
            ? { ...updatedAddress, updated_at: new Date() }
            : addr
        )
      );

      // Close the form
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Đã có lỗi xảy ra khi lưu địa chỉ",
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {existingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {errors.general && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border ${errors.full_name ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border ${errors.phone_number ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="address_detail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Địa chỉ chi tiết
          </label>
          <textarea
            id="address_detail"
            name="address_detail"
            value={formData.address_detail}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={2}
            className={`w-full px-4 py-2 border ${errors.address_detail ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            placeholder="Số nhà, tên đường..."
          />
          {errors.address_detail && (
            <p className="mt-1 text-sm text-red-600">{errors.address_detail}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tỉnh / Thành phố
            </label>
            <select
              id="province"
              name="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              className={`w-full px-4 py-2 border ${errors.province ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            >
              <option value="">Chọn tỉnh / thành phố</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.full_name}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{errors.province}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quận / Huyện
            </label>
            <select
              id="district"
              name="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className={`w-full px-4 py-2 border ${errors.district ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              disabled={!selectedProvince}
            >
              <option value="">Chọn quận / huyện</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.full_name}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="mt-1 text-sm text-red-600">{errors.district}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="ward"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phường / Xã
            </label>
            <select
              id="ward"
              name="ward"
              value={selectedWard}
              onChange={handleWardChange}
              className={`w-full px-4 py-2 border ${errors.ward ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              disabled={!selectedDistrict}
            >
              <option value="">Chọn phường / xã</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.full_name}
                </option>
              ))}
            </select>
            {errors.ward && (
              <p className="mt-1 text-sm text-red-600">{errors.ward}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quốc gia
          </label>
          {/* <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          /> */}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={formData.is_default}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_default"
            className="ml-2 block text-sm text-gray-700"
          >
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {existingAddress ? "Cập nhật" : "Thêm địa chỉ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
