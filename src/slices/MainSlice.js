import { createSlice } from "@reduxjs/toolkit";

const MainSlice = createSlice({
  name: "MainSlice",
  initialState: {
    filter: 0,
  },
  reducers: {
    setFilter: (state, action) => {
      let filterValue = action.payload;
      return { filter: filterValue };
    },
  },
});



export const { setFilter } = MainSlice.actions;


export default MainSlice.reducer;
