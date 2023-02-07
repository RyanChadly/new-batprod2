import { ConfigProvider, theme } from "antd";
import React, { useEffect } from "react";
import { MainPage } from "./components/main-page/main-page";
import { mockOrders } from "./mocks/orders";
import { mockProducts } from "./mocks/products";
import { mockRessources } from "./mocks/ressources";
import { useAppDispatch } from "./store/hooks";
import { addOrders } from "./store/orders-slice";
import { addProducts } from "./store/products-slice";
import { addRessources } from "./store/ressources-slice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(addOrders(mockOrders));
    dispatch(addRessources(mockRessources));
    dispatch(addProducts(mockProducts));
  }, [dispatch]);

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <MainPage />
      </ConfigProvider>
    </div>
  );
}

export default App;
