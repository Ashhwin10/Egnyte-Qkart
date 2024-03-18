import { createSlice } from "@reduxjs/toolkit";

export const reduxSlice = createSlice({
  name: "loginStatus",
  initialState: { isLoggedIn: false },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
    },
  },
});

export const { loginSuccess } = reduxSlice.actions;
export default reduxSlice.reducer;
