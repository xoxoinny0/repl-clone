import { createSlice } from "@reduxjs/toolkit";

const MapFinerSlice = createSlice({
  name: "MapFinerSlice",
  initialState: {
    keyword: '',
  },
  reducers: {
    setKeyword: (state, action) => {
      let keywordValue = action.payload;
      return { keyword: keywordValue };
    },
  },
});



export const { setKeyword } = MapFinerSlice.actions;


export default MapFinerSlice.reducer;