// redux/authSlice.js

import { RootState } from "@/lib/store";
import { dtoGetUser } from "@/models/auth/dtoUser";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "",
  userProfile: {} as dtoGetUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { accessToken, refreshToken, userProfile } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userProfile = userProfile;
    },
    clearAuthData: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.userProfile = {} as any; // Reset to initial state
    },
    setUser: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setAuthData, clearAuthData, setUser } = authSlice.actions;
export const selectAuthLogin = (state: RootState) => state.auth;

export default authSlice.reducer;
