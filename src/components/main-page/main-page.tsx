import React, { useState } from "react";
import { DatePicker, Layout, Menu, MenuProps, theme } from "antd";
import "./main-page.css";
import { BsPeople } from "react-icons/bs";
import { TbBuildingFactory2, TbBottle, TbList } from "react-icons/tb";
import { SimulatorButton } from "../simulator-button";
import { ProductPage } from "../product-page/product-page";
import { OrderPage } from "../order-page/order-page";

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
export const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }
  const defaultSelectedKeys = "Orders";
  const [content, setContent] = useState(defaultSelectedKeys);
  function changeMenu({ key }: { key: string }) {
    setContent(key);
  }
  const items: MenuItem[] = [
    getItem("Produits", "Products", <TbBottle />),
    getItem("Commandes", "Orders", <TbList />),
    getItem("Ressources", "Ressources", <TbBuildingFactory2 />),
    getItem("Personel", "People", <BsPeople />),
  ];

  return (
    <Layout className={"layout"}>
      <Sider breakpoint="lg" collapsedWidth="60">
        <Menu
          onClick={changeMenu}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[defaultSelectedKeys]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colorBgContainer,
          }}
        >
          <SimulatorButton />
          <DatePicker placeholder="" />
        </Header>
        <Content style={{ margin: "24px 16px 0", overflowY: "scroll" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
            }}
          >
            {content === "Products" && <ProductPage />}
            {content === "Orders" && <OrderPage />}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Ryan Chadly ©2023</Footer>
      </Layout>
    </Layout>
  );
};
