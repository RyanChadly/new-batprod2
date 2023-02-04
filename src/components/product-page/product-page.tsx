import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ProductDescription } from "./product-descriptions";

export const ProductPage = () => {
  return (
    <>
      <ProductDescription />
      <Button
        type={"primary"}
        style={{
          display: "inline-block",
          position: "absolute",
          bottom: 80,
          right: 40,
          zIndex: 1,
        }}
        icon={<PlusOutlined />}
      ></Button>
    </>
  );
};
