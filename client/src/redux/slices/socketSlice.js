import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

const initialState = {
  socket: null,
  onlineUsers: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    clearSocket: (state) => {
      if (state.socket?.connected) {
        state.socket.disconnect();
      }
      state.socket = null;
      state.onlineUsers = [];
    },
  },
});





export const { setOnlineUsers, setSocket , clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
