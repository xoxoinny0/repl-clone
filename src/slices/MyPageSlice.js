import { createSlice } from "@reduxjs/toolkit";

const MyPageSlice = createSlice({
  name: "MainSlice",
  initialState: {
    currentTab: 0,
  },
  reducers: {
    setTab: (state, action) => {
      let tabValue = action.payload;
      return { currentTab: tabValue };
    },
  },
});



export const { setTab } = MyPageSlice.actions;


export default MyPageSlice.reducer;
