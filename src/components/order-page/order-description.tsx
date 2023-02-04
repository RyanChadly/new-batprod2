import React, { useState } from "react";
import { Button, Descriptions, Divider } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getFullShortTime } from "../../utils/utils";
import { deleteOrder } from "../../store/orders-slice";
import { OrderParams } from "../../utils/types";
import { ProductsDrawer } from "./order-drawer";

export const OrderDescriptions = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders);
  const deleteOrd = (order: OrderParams) => dispatch(deleteOrder(order));
  const [openDrawer, setOpenDrawer] = useState(false);
  const closeDrawer = () => setOpenDrawer(false);
  return (
    <>
      {orders.map((order) => (
        <div key={order.id}>
          <Divider></Divider>
          <Descriptions
            title={order.customer}
            size={"small"}
            column={1}
            extra={
              <>
                <Button
                  onClick={() => setOpenDrawer(true)}
                  type="default"
                  icon={<EditOutlined />}
                ></Button>
                <Button
                  onClick={() => deleteOrd(order)}
                  type="default"
                  danger
                  style={{ marginLeft: 24 }}
                  icon={<DeleteOutlined />}
                ></Button>
              </>
            }
            labelStyle={{ fontWeight: "bold" }}
          >
            <Descriptions.Item label={"Produit"}>
              {order.product.name}
            </Descriptions.Item>
            <Descriptions.Item label={"Volume (L)"}>
              {order.litres}
            </Descriptions.Item>
            <Descriptions.Item label={"Debut"}>
              {getFullShortTime(new Date(JSON.parse(order.startTime)))}
            </Descriptions.Item>
            <Descriptions.Item label={"Echeance"}>
              {getFullShortTime(new Date(JSON.parse(order.deadline)))}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ))}
      <ProductsDrawer open={openDrawer} close={closeDrawer} />
    </>
  );
};
