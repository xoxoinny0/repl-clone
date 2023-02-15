/**
 * MapAdd 페이지 모달창 제어 - 장윤신
 */
import { createSlice } from "@reduxjs/toolkit";

const MapAddSlice = createSlice({
  name: "MapAddSlice",

  initialState: {
    modalIsOpen1: false,
    modalIsOpen2: false,
    modalIsOpen3: false,
  },

  reducers: {
    modalOpen1: (state, action) => {
      return { modalIsOpen1: true, modalIsOpen2: false, modalIsOpen3: false };
    },
    modalOpen2: (state, action) => {
      return { modalIsOpen1: false, modalIsOpen2: true, modalIsOpen3: false };
    },
    modalOpen3: (state, action) => {
      return { modalIsOpen1: false, modalIsOpen2: false, modalIsOpen3: true };
    },

    themeOpen: (state, action) => {
      return { modalIsOpen1: false, modalIsOpen2: false, modalIsOpen3: false };
    },

    modalClose: (state, action) => {
      return { modalIsOpen1: false, modalIsOpen2: false, modalIsOpen3: false };
    },
  },
});

export const { modalOpen1, modalOpen2, modalOpen3, modalClose } = MapAddSlice.actions;

export default MapAddSlice.reducer;
