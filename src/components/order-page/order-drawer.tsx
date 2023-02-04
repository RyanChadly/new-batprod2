import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import { useAppSelector } from "../../store/hooks";
import { OrderParams } from "../../utils/types";

interface PropsType {
  open: boolean;
  close: () => void;
  order?: OrderParams;
}

export const ProductsDrawer: React.FC<PropsType> = ({ open, close, order }) => {
  const [clientName, setClientName] = useState<string | undefined>(undefined);
  const [productName, setProductName] = useState<string | undefined>(undefined);
  const [volumeL, setVolumeL] = useState<number | null>(null);
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);

  const products = useAppSelector((state) => state.products);
  function cannotSave(): boolean {
    return !!clientName && !!productName && !!volumeL && !!start && !!end;
  }
  function onFinish(values: any[]) {
    close();
  }
  function onChangeRange(e: any) {
    if (e) {
      setStart(e[0].$d);
      setEnd(e[1].$d);
    }
  }
  return (
    <Drawer placement="right" onClose={close} open={open}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Client" name="clientName">
          <Input
            onChange={(e) => setClientName(e.target.value)}
            defaultValue={order ? order.customer : ""}
          />
        </Form.Item>

        <Form.Item label="Produit" name="product">
          <Select
            onChange={(e) => setProductName(e)}
            options={products.map((product) => ({
              value: product.name,
              label: product.name,
            }))}
          ></Select>
        </Form.Item>

        <Form.Item label="Volume (L)" name="volumeL">
          <InputNumber
            onChange={(v) => setVolumeL(v)}
            min={0}
            defaultValue={0}
          />
        </Form.Item>

        <Form.Item label="Periode" name="timeRange">
          <DatePicker.RangePicker
            onChange={onChangeRange}
            showTime={{ format: "HH:mm" }}
            format="DD-MM-YYYY HH:mm"
            placeholder={["debut", "fin"]}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={!cannotSave()}>
              Confirmer
            </Button>
            <Button onClick={close}>Annuler</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
