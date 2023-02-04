import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./products-slice";
import ressourcesSlice from "./ressources-slice";
import orderSlice from "./orders-slice";

const reducer = {
  products: productSlice,
  ressources: ressourcesSlice,
  orders: orderSlice,
};

const store = configureStore({
  reducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
