import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "@/app/types";

const STORAGE_KEY = "cipher_auth";

interface AuthState {
  isLoggedIn: boolean;
  role: Role | null;
}

function loadFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch { /* ignore */ }
  return { isLoggedIn: false, role: null };
}

const initialState: AuthState = loadFromStorage();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.role = null;
      state.isLoggedIn = false;
    },
  },
});

export const CIPHER_AUTH_STORAGE_KEY = STORAGE_KEY;
export const { setRole, logout } = authSlice.actions;
export default authSlice.reducer;
