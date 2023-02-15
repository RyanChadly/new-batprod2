import { DatePicker, Empty, Select, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Calendar } from "./calendar";

export const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
  const [selection, setSelection] = useState([]);

  return (
    <>
      <Space direction="vertical">
        <DatePicker
          allowClear={false}
          defaultValue={dayjs(new Date())}
          onChange={(e) => setDate(e)}
        />
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select"
          onChange={(e) => setSelection(e)}
          options={[
            { label: "Ressources", value: "ressources" },
            { label: "Commandes", value: "orders" },
            { label: "Personnel", value: "employees" },
          ]}
        />
        {!selection.length || !date ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Calendar />
        )}
      </Space>
    </>
  );
};
