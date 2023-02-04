import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RessourceParams } from "../utils/types";

const initialState: RessourceParams[] = [];

const ressourcesSlice = createSlice({
  name: "ressources",
  initialState,
  reducers: {
    addRessources(state, action: PayloadAction<RessourceParams[]>) {
      return action.payload;
    },
  },
});
export const { addRessources } = ressourcesSlice.actions;
export default ressourcesSlice.reducer;
