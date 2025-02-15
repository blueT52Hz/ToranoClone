import { Flex, Popover } from "antd";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

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
  collections: Item[];
}

const PopoverCollection = (props: Props) => {
  const { collections } = props;
  return (
    <Popover
      title={null}
      placement="bottom"
      color="#F8FAFC"
      content={
        <div className="w-screen px-12">
          <Flex justify="space-evenly">
            {collections.map((item, index) => {
              return (
                <Flex vertical key={index}>
                  <Link to={"/"} className="font-bold text-base">
                    {item.name}
                  </Link>
                  {item.sub_items.map((sub_item, i) => (
                    <Link
                      to={`/collections/${sub_item.slug}`}
                      key={i}
                      className="my-2"
                    >
                      {sub_item.name}
                    </Link>
                  ))}
                </Flex>
              );
            })}
            <Link to={"/"}>
              <img
                className="w-[32rem]"
                src="https://theme.hstatic.net/200000690725/1001078549/14/mega_menu_5_img.jpg?v=647"
                alt=""
              />
            </Link>
          </Flex>
        </div>
      }
    >
      <Flex className="cursor-pointer group" gap={5} align="center">
        <Link to={`/`}>Bộ sưu tập</Link>
        <ChevronDown
          size={16}
          className="opacity-70 transition-transform duration-200 group-hover:rotate-180"
        ></ChevronDown>
      </Flex>
    </Popover>
  );
};

export default PopoverCollection;
