import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { OrderParams } from "../../utils/types";
import { addOrder, modifyOrder } from "../../store/orders-slice";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

interface PropsType {
  close: () => void;
  order?: OrderParams;
}

export const OrderForm: React.FC<PropsType> = ({ close, order }) => {
  const [customerName, setCustomerName] = useState<string | undefined>(
    order?.customer
  );
  const [productName, setProductName] = useState<string | undefined>(
    order?.product.name
  );
  const [volumeL, setVolumeL] = useState<number | null>(order?.litres ?? null);
  const [start, setStart] = useState<Date | undefined>(
    order ? new Date(JSON.parse(order.startTime)) : undefined
  );
  const [end, setEnd] = useState<Date | undefined>(
    order ? new Date(JSON.parse(order.deadline)) : undefined
  );
  const products = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  function cannotSave(): boolean {
    return !!customerName && !!productName && !!volumeL && !!start && !!end;
  }

  function submitForm() {
    const product = products.find((p) => p.name === productName);
    if (customerName && volumeL && product && start && end) {
      const newOrder = {
        id: order?.id ?? uuidv4(),
        startTime: JSON.stringify(start),
        deadline: JSON.stringify(end),
        customer: customerName,
        litres: volumeL,
        product,
      };
      if (order) {
        dispatch(modifyOrder(newOrder));
      } else {
        dispatch(addOrder(newOrder));
      }
    }
    close();
  }

  function onChangeRange(e: any) {
    if (e) {
      setStart(e[0].$d);
      setEnd(e[1].$d);
    }
  }

  return (
    <Form layout="vertical">
      <Form.Item label="Client" name="clientName">
        <Input
          onChange={(e) => setCustomerName(e.target.value)}
          defaultValue={order ? order.customer : ""}
        />
      </Form.Item>

      <Form.Item label="Produit" name="product">
        <Select
          onChange={(e) => setProductName(e)}
          defaultValue={productName}
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
          defaultValue={volumeL ?? 0}
        />
      </Form.Item>

      <Form.Item label="Periode" name="timeRange">
        <DatePicker.RangePicker
          defaultValue={
            order
              ? [
                  dayjs(new Date(JSON.parse(order?.startTime))),
                  dayjs(new Date(JSON.parse(order?.deadline))),
                ]
              : [dayjs(), dayjs()]
          }
          onChange={onChangeRange}
          showTime={{ format: "HH:mm" }}
          format="DD-MM-YYYY HH:mm"
          placeholder={["debut", "fin"]}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            onClick={submitForm}
            disabled={!cannotSave()}
          >
            Confirmer
          </Button>
          <Button onClick={close}>Annuler</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
