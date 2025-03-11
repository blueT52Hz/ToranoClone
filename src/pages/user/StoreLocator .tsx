import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { MapPin, MapPinMinus } from "lucide-react";

const { Option } = Select;

interface Store {
  name: string;
  address: string;
  time: string;
  phone: string;
}

interface DistrictStores {
  [district: string]: Store[];
}

interface StoreData {
  [city: string]: DistrictStores;
}

const storeData: StoreData = {
  "Hà Nội": {
    "Đống Đa": [
      {
        name: "TORANO 02 CHÙA BỘC",
        address: "Số 02, Chùa Bộc, Đống Đa, Hà Nội",
        time: "8:30 - 22:00",
        phone: "097 640 8388",
      },
      {
        name: "TORANO 31 YÊN LÃNG",
        address: "Số 31 Yên Lãng, Quận Đống Đa, Hà Nội",
        time: "8:30 - 22:00",
        phone: "0969963658",
      },
    ],
  },
};

const StoreLocator = () => {
  const [city, setCity] = useState("Hà Nội");
  const [district, setDistrict] = useState("Đống Đa");
  const [stores, setStores] = useState(storeData["Hà Nội"]["Đống Đa"]);
  const [selectedLocation, setSelectedLocation] = useState(stores[0]);

  const handleCityChange = (value: string) => {
    setCity(value);
    const firstDistrict = Object.keys(storeData[value])[0];
    setDistrict(firstDistrict);
    setStores(storeData[value][firstDistrict]);
    setSelectedLocation(storeData[value][firstDistrict][0]);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setStores(storeData[city][value]);
    setSelectedLocation(storeData[city][value][0]);
  };

  return (
    <section className="storeLocator">
      <div className="container mx-auto py-4 px-6">
        <h2 className="text-center text-3xl font-bold mb-4">
          Hệ thống cửa hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow-md rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Tìm cửa hàng</h3>

            <label className="block font-medium mb-2 text-sm">
              Chọn tỉnh thành
            </label>
            <Select
              className="w-full mb-4"
              value={city}
              onChange={handleCityChange}
            >
              {Object.keys(storeData).map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>

            <label className="block font-medium mb-2 text-sm">
              Chọn cửa hàng
            </label>
            <Select
              className="w-full mb-4"
              value={district}
              onChange={handleDistrictChange}
            >
              {Object.keys(storeData[city]).map((district) => (
                <Option key={district} value={district}>
                  {district}
                </Option>
              ))}
            </Select>

            {stores.map((store, index) => (
              <div
                key={index}
                className={`my-4 cursor-pointer flex gap-2`}
                onClick={() => setSelectedLocation(store)}
              >
                <MapPin></MapPin>
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-semibold">{store.name}</h4>
                  <p className="text-sm ">{store.address}</p>
                  <p className="text-sm ">Thời gian: {store.time}</p>
                  <p className="text-sm ">Điện thoại: {store.phone}</p>
                  <div
                    className="text-blue-500 cursor-pointer text-sm underline"
                    onClick={() => setSelectedLocation(store)}
                  >
                    Xem bản đồ
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative w-full h-full rounded-lg overflow-hidden col-span-2">
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.google.com/maps?q=${selectedLocation.address}&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocator;
