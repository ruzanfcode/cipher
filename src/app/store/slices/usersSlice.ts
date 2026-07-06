import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { USERS } from "@/data/mockData";
import type { SBUUser } from "@/app/types";

interface UsersState {
  users: SBUUser[];
}

const initialState: UsersState = {
  users: USERS,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<SBUUser, "id" | "status" | "lastActive">>) => {
      state.users.push({
        ...action.payload,
        id: Date.now(),
        status: "Pending",
        lastActive: "Never",
      });
    },
    rejectInvitation: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    disableUser: (state, action: PayloadAction<number>) => {
      const user = state.users.find(item => item.id === action.payload);
      if (user && user.status === "Active") user.status = "Disabled";
    },
    activateUser: (state, action: PayloadAction<number>) => {
      const user = state.users.find(item => item.id === action.payload);
      if (user && user.status === "Disabled") user.status = "Active";
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
});

export const { addUser, rejectInvitation, disableUser, activateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;