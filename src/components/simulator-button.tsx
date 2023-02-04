import { RocketOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { simulate } from "../simulator/simulator";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addOrders } from "../store/orders-slice";
import { addRessources } from "../store/ressources-slice";

export const SimulatorButton = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders);
  const ressources = useAppSelector((state) => state.ressources);

  const start = () => {
    const { orders: newOrders, ressources: newRessources } = simulate(
      orders,
      ressources
    );
    dispatch(addOrders(newOrders));
    dispatch(addRessources(newRessources));
  };

  return (
    <Button
      icon={<RocketOutlined />}
      type={"primary"}
      onClick={start}
      style={{ marginRight: 24 }}
    >
      Simuler
    </Button>
  );
};
