// drawerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DrawerState {
  progress: number;
}

const initialState: DrawerState = { progress: 0 };

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    setDrawerProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
  },
});

export const { setDrawerProgress } = drawerSlice.actions;
export default drawerSlice.reducer;
