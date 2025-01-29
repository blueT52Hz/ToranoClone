import { Flex } from "antd";
import { Mail, Minus, PhoneCall, Plus } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "@components/Header/style.css";

interface Sub_Item {
  slug: string;
  name: string;
}

interface Item {
  name: string;
  slug: string;
  sub_items: Sub_Item[];
}

interface Props {
  categories: Item[];
  collections: Item[];
}

const Sidebar = (props: Props) => {
  const { categories, collections } = props;
  const [expanse, setExpanse] = useState<boolean[]>([false, false, false]);
  const [collectionExpanse, setCollectionExpanse] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const onClickCollectionExpanseBtn = (index: number) => {
    setCollectionExpanse(
      collectionExpanse.map((item, i) => (index === i ? !item : item))
    );
  };

  const onClickExpanseBtn = (index: number) => {
    setExpanse(expanse.map((item, i) => (index === i ? !item : item)));
  };
  return (
    <>
      <Flex
        vertical
        justify="space-between"
        className="w-full h-full overflow-auto scrollbar-hidden"
      >
        <Flex vertical gap={20}>
          <Link
            to={"/collections/new-1"}
            className="font-bold hover:text-red-600 cursor-pointer"
          >
            Sản phẩm mới
          </Link>
          <Link
            to={"/collections/onsale"}
            className="font-bold hover:text-red-600 cursor-pointer"
          >
            Sale
          </Link>

          {/* Áo/Quần nam */}
          {categories.map((item, index) => {
            return (
              <Flex vertical className="select-none" key={index}>
                <Flex justify="space-between" className="group cursor-pointer">
                  <Link
                    to={`/collections/${item.slug}`}
                    className="group-hover:text-red-600 font-bold w-full"
                  >
                    {item.name}
                  </Link>
                  {!expanse[index] ? (
                    <Plus
                      onClick={() => onClickExpanseBtn(index)}
                      size={20}
                    ></Plus>
                  ) : (
                    <Minus
                      onClick={() => onClickExpanseBtn(index)}
                      size={20}
                    ></Minus>
                  )}
                </Flex>
                {expanse[index] && (
                  <Flex vertical className="px-4 mt-2">
                    {item.sub_items.map((sub_item, sub_index) => {
                      return (
                        <Link
                          key={sub_index}
                          to={`/collections/${sub_item.slug}`}
                          className="hover:text-red-600"
                        >
                          <div className="my-2">{sub_item.name}</div>
                        </Link>
                      );
                    })}
                  </Flex>
                )}
              </Flex>
            );
          })}

          {/* Bộ sưu tập */}
          <Flex vertical className="select-none">
            <Flex justify="space-between" className="group cursor-pointer">
              <Link
                to={`/`}
                className="group-hover:text-red-600 font-bold w-full"
              >
                Bộ sưu tập
              </Link>
              {!expanse[2] ? (
                <Plus onClick={() => onClickExpanseBtn(2)} size={20}></Plus>
              ) : (
                <Minus onClick={() => onClickExpanseBtn(2)} size={20}></Minus>
              )}
            </Flex>
            {expanse[2] && (
              <Flex vertical className="selcect-none pl-2 pt-4" gap={15}>
                {collections.map((item, index) => {
                  return (
                    <Flex vertical>
                      <Flex className="group cursor-pointer">
                        <Link
                          to={`/`}
                          className="group-hover:text-red-600 w-full"
                        >
                          {item.name}
                        </Link>
                        {!collectionExpanse[index] ? (
                          <Plus
                            onClick={() => onClickCollectionExpanseBtn(index)}
                            size={20}
                          ></Plus>
                        ) : (
                          <Minus
                            onClick={() => onClickCollectionExpanseBtn(index)}
                            size={20}
                          ></Minus>
                        )}
                      </Flex>
                      {collectionExpanse[index] && (
                        <Flex vertical className="px-4 mt-2">
                          {item.sub_items.map((sub_item, sub_index) => {
                            return (
                              <a
                                target="_blank"
                                key={sub_index}
                                href={`https://collection.torano.vn/${sub_item.slug}`}
                                className="hover:text-red-600"
                              >
                                <div className="my-2">{sub_item.name}</div>
                              </a>
                            );
                          })}
                        </Flex>
                      )}
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </Flex>

          <Link
            to={"/pages/he-thong-cua-hang"}
            className="font-bold hover:text-red-600 cursor-pointer"
          >
            Hệ thống cửa hàng
          </Link>
          <Link
            to={"/pages/tang-voucher-20-30"}
            className="font-bold hover:text-red-600 cursor-pointer"
          >
            Ưu đãi
          </Link>
        </Flex>
      </Flex>
      <Flex vertical gap={20} className="sticky bottom-0 w-full pt-4 bg-white">
        <div className="font-semibold text-base">BẠN CẦN HỖ TRỢ?</div>
        <Flex gap={15} align="center" className="cursor-pointer">
          <PhoneCall size={25}></PhoneCall>
          <a href="tel:0964942121" className="hover:text-red-600">
            0964.942.121
          </a>
        </Flex>
        <Flex gap={15} align="center" className="cursor-pointer">
          <Mail size={25}></Mail>
          <a href="mailto:cskh@torano.vn" className="hover:text-red-600">
            cskh@torano.vn
          </a>
        </Flex>
      </Flex>
    </>
  );
};

export default Sidebar;
