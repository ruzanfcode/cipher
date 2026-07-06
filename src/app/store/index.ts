import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "@/app/store/reducers";
import { CIPHER_AUTH_STORAGE_KEY } from "@/app/store/slices/authSlice";

export const store = configureStore({
  reducer: rootReducer,
});

store.subscribe(() => {
  const { auth } = store.getState();
  try {
    localStorage.setItem(
      CIPHER_AUTH_STORAGE_KEY,
      JSON.stringify({ isLoggedIn: auth.isLoggedIn, role: auth.role }),
    );
  } catch { /* ignore */ }
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
