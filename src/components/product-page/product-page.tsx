import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ProductDescription } from "./product-descriptions";

export const ProductPage = () => {
  return (
    <>
      <Button
        type={"primary"}
        icon={<PlusOutlined />}
        style={{ marginBottom: 24 }}
      >
        Ajouter
      </Button>
      <ProductDescription />
    </>
  );
};
