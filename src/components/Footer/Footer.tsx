import Contacts from "@/components/Footer/Contacts";
import Copyright from "@/components/Footer/Copyright";
import Fashion from "@/components/Footer/Fashion";
import GroupLinks from "@/components/Footer/GroupLinks";
import Subcribe from "@/components/Footer/Subcribe";
import { Flex } from "antd";
import React from "react";

const Footer = () => {
  const mobileWidth = window.innerWidth < 850;
  return (
    <footer>
      <Flex
        className="absolute bottom-0 bg-[#f5f5f5] w-full min850:px-12 flex"
        vertical
      >
        <Flex vertical={mobileWidth}>
          {mobileWidth && <Subcribe></Subcribe>}
          <Fashion></Fashion>
          <Contacts></Contacts>
          <GroupLinks></GroupLinks>
          {!mobileWidth && <Subcribe></Subcribe>}
        </Flex>
        <Copyright></Copyright>
      </Flex>
    </footer>
  );
};

export default Footer;
