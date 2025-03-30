import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import authReducer from "./authSlice"; // Ensure correct path

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    auth: authReducer, // Add the auth reducer
  },
});
