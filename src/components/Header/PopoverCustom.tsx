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
  item: Item;
}

const PopoverCustom = (props: Props) => {
  const { item } = props;
  return (
    <Popover
      title={null}
      placement="bottom"
      color="#F8FAFC"
      content={
        <div className="w-40">
          <Flex vertical gap="1rem" className="w-full px-4">
            {item.sub_items.map((sub_item, index) => (
              <Link to={`/collections/${sub_item.slug}`} key={index}>
                {sub_item.name}
              </Link>
            ))}
          </Flex>
        </div>
      }
    >
      <Flex className="cursor-pointer group" gap={5} align="center">
        <Link to={`/collections/${item.slug}`}>{item.name}</Link>
        <ChevronDown
          size={16}
          className="opacity-70 transition-transform duration-200 group-hover:rotate-180"
        ></ChevronDown>
      </Flex>
    </Popover>
  );
};

export default PopoverCustom;
