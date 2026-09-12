import { createSlice } from "@reduxjs/toolkit";

//Tokens have been stored both JSON-encoded and raw, and a parse error here
//would run at import time and take the whole app down, so never throw.
const readToken = () => {
  try {
    const stored = localStorage.getItem("token");
    if (!stored) return null;

    //a raw JWT is not valid JSON, so fall back to using it as-is
    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  } catch {
    return null;
  }
};

const initialState = {
  //email being verified, carried from signup/forgot-password into the OTP screen
  signupData: null,
  token: readToken(),
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
