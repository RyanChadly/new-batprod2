import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderParams } from "../utils/types";

const initialState: OrderParams[] = [];

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrders(_state, action: PayloadAction<OrderParams[]>) {
      return action.payload;
    },
    deleteOrder(state, action: PayloadAction<OrderParams>) {
      return state.filter((order) => order.id !== action.payload.id);
    },
    addOrder(state, action: PayloadAction<OrderParams>) {
      return [...state, action.payload];
    },
  },
});

export const { addOrders, deleteOrder, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
