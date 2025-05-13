import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        // toggleTheme: (state) => {
        //     const newTheme = state.theme ;
        //     state.theme = newTheme;
        //     localStorage.setItem('theme', newTheme); 
        //   },
    },

});
export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;