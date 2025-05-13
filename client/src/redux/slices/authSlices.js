import { createSlice } from "@reduxjs/toolkit";

const getTokenExp = (token)=> {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ?? null;
  } catch (e) {
    return null;
  }
};


const initialState = {
  user: localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const userData = action.payload;
      if(userData?.accessToken) {
        const exp = getTokenExp(userData.accessToken);
        if (exp) {
          userData.exp = exp;
        }
      }
      state.user = userData;
      localStorage.setItem("userInfor", JSON.stringify(userData));
    },
    Exit(state) {
      state.user = null;
      localStorage.removeItem("userInfor");
    },
  },
});

export const { setCredentials , Exit } = authSlice.actions;
export default authSlice.reducer;