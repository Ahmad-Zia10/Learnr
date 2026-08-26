import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //email being verified, carried from signup/forgot-password into the OTP screen
  signupData: null,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
      //keep localStorage in sync so a refresh keeps the user signed in
      if (value.payload) {
        localStorage.setItem("token", JSON.stringify(value.payload));
      } else {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setSignupData, setToken } = authSlice.actions;

export default authSlice.reducer;
