import React, { useState } from "react";
import { Button, Flex, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Login = () => {
  const [position, setPosition] = useState<"start" | "end">("end");
  return (
    <>
      <Flex gap="small" wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </Flex>
    </>
  );
};

export default Login;
