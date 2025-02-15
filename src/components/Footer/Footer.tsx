import Contacts from "@/components/Footer/Contacts";
import Copyright from "@/components/Footer/Copyright";
import Fashion from "@/components/Footer/Fashion";
import GroupLinks from "@/components/Footer/GroupLinks";
import Subcribe from "@/components/Footer/Subcribe";
import { Flex } from "antd";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const [mobileWidth, setMobileWidth] = useState(window.innerWidth < 850);
  useEffect(() => {
    const handleResize = () => {
      setMobileWidth(window.innerWidth <= 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <footer>
      <Flex className=" bottom-0 bg-[#f5f5f5] w-full min850:px-8 flex" vertical>
        <Flex vertical={mobileWidth} wrap>
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
