import { configureStore } from "@reduxjs/toolkit";
import reduxReducer from "../redux/store.js";

export const store = configureStore({
  reducer: {
    loginStatus: reduxReducer,
  },
});
