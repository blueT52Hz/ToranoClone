import { Divider, Flex } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Copyright = () => {
  const [mobileWidth, setMobileWidth] = useState(window.innerWidth < 850);
  useEffect(() => {
    setMobileWidth(window.innerWidth < 850);
  }, [window.innerWidth]);
  return (
    <>
      {mobileWidth && <Divider className="m-0"></Divider>}
      <Flex className="py-4 text-sm text-[#000000] " justify="center">
        <p>
          Copyright © 2025 {" | "}
          <Link to="/">Torano</Link>
          {" | "}
          <Link to="/">Clone by bluet52hzzz</Link>
        </p>
      </Flex>
    </>
  );
};

export default Copyright;
