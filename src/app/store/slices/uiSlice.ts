import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ToastVariant = "success" | "failed" | "warning";

export interface ToastState {
  message: string;
  variant: ToastVariant;
}

interface UIState {
  toast: ToastState | null;
}

const initialState: UIState = {
  toast: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<string | ToastState>) => {
      state.toast = typeof action.payload === "string" ? { message: action.payload, variant: "success" } : action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const { showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
