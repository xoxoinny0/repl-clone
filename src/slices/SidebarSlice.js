import { createSlice } from "@reduxjs/toolkit";

const SidebarSlice = createSlice({
  name: "SidebarSlice",
  initialState: {
    isActive : false,
  },
  reducers: {
    setActive : (state, action) => {
      let isActiveValue  = action.payload;
      return { isActive : isActiveValue };
    }
  },
});

export const { setActive } = SidebarSlice.actions;

export default SidebarSlice.reducer;