import React from "react";
import { Button, Descriptions, Table } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteProduct } from "../../store/products-slice";
import "./product-descriptions.css";

export const ProductDescription = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  const deleteProd = (name: string) => dispatch(deleteProduct(name));
  return (
    <>
      {products.map((product) => (
        <div className="description-wrapper" key={product.name}>
          {/* <Divider></Divider> */}
          <Descriptions
            title={product.name}
            size={"small"}
            column={1}
            extra={
              <>
                <Button
                  type="default"
                  size="small"
                  icon={<EditOutlined />}
                ></Button>
                <Button
                  onClick={() => deleteProd(product.name)}
                  type="default"
                  size="small"
                  danger
                  style={{ marginLeft: 10 }}
                  icon={<DeleteOutlined />}
                ></Button>
              </>
            }
            labelStyle={{ fontWeight: "bold" }}
          >
            <Descriptions.Item label={"Creme %"}>
              {product.cremeAmount * 100}
            </Descriptions.Item>
            <Descriptions.Item label={"Lait %"}>
              {product.milkAmount * 100}
            </Descriptions.Item>
            <Descriptions.Item label={"Taches"}>
              <></>
            </Descriptions.Item>
          </Descriptions>

          <Table
            size={"small"}
            pagination={false}
            dataSource={product.tasks}
            columns={[
              { title: "Nom", dataIndex: "name", key: "name" },
              { title: "Minutes", dataIndex: "minutes", key: "minutes" },
              {
                title: "Minutes/L",
                dataIndex: "minutesPerLitre",
                key: "minutesPerLitre",
              },
              {
                title: "Ressource",
                dataIndex: "ressourcesTypes",
                key: "ressourcesTypes",
              },
            ]}
          />
        </div>
      ))}
    </>
  );
};
