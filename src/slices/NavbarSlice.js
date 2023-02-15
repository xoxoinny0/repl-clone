import { createSlice } from "@reduxjs/toolkit";

const NavbarSlice = createSlice({
  name: "NavbarSlice",
  initialState: {
    navActive : false,
  },
  reducers: {
    setNavActive : (state, action) => {
      let isNavActiveValue  = action.payload;
      return { navActive : isNavActiveValue };
    }
  },
});



export const { setNavActive } = NavbarSlice.actions;


export default NavbarSlice.reducer;
