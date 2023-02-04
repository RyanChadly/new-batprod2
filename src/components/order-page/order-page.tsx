import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { OrderDescriptions } from "./order-description";

export const OrderPage = () => {
  return (
    <>
      <Button
        type={"primary"}
        style={{ position: "fixed" }}
        icon={<PlusOutlined />}
      ></Button>
      <OrderDescriptions />
    </>
  );
};
