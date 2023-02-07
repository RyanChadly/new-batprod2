import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { OrderDescription } from "./order-description";
import { useAppSelector } from "../../store/hooks";
import { OrderDrawer } from "./order-drawer";

export const OrderPage = () => {
  const orders = useAppSelector((state) => state.orders);
  const [openDrawer, setOpenDrawer] = useState(false);
  const closeDrawer = () => setOpenDrawer(false);
  return (
    <>
      <Button
        onClick={() => setOpenDrawer(true)}
        type={"primary"}
        icon={<PlusOutlined />}
        style={{ marginBottom: 24 }}
      >
        Ajouter
      </Button>
      <OrderDrawer open={openDrawer} close={closeDrawer} />
      {orders.map((order) => (
        <OrderDescription order={order} key={order.id} />
      ))}
    </>
  );
};
