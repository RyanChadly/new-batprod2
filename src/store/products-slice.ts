import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../utils/types";

const initialState: Product[] = [];

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProducts(state, action: PayloadAction<Product[]>) {
      return action.payload;
    },
    deleteProduct(state, action: PayloadAction<string>) {
      return state.filter((product) => product.name !== action.payload);
    },
  },
});

export const { addProducts, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
