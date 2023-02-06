import { Drawer } from "antd";
import { OrderParams } from "../../utils/types";
import { OrderForm } from "./order-form";

interface PropsType {
  open: boolean;
  close: () => void;
  order?: OrderParams;
}

export const OrderDrawer: React.FC<PropsType> = ({ open, close, order }) => {
  return (
    <Drawer
      placement="right"
      onClose={close}
      open={open}
      destroyOnClose
      closable={false}
    >
      <OrderForm order={order} close={close} />
    </Drawer>
  );
};
