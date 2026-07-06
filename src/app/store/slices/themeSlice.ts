import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode } from "@/app/types";

interface ThemeState {
  themeMode: ThemeMode;
}

const initialState: ThemeState = {
  themeMode: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
