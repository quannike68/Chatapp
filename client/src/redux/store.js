import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlices.js";
import { apiSlice } from "../redux/slices/apiSlice.js";
import themeReducer from "../redux/slices/themeSlice.js";
import socketReducer from "../redux/slices/socketSlice.js";
import selectedUserReducer from "../redux/slices/selectedUserSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    socket: socketReducer,
    selectedUser: selectedUserReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaulMiddleware) =>
    getDefaulMiddleware().concat(apiSlice.middleware),
  devTools: true,
});


export default store;