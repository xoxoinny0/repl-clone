/**
 * theme 데이터 슬라이스 - 장윤신
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";
import { cloneDeep } from "lodash";

/** 모든 테마 데이터를 불러오는 비동기 함수 */
export const getThemeData = createAsyncThunk(
  "ThemeSlice/getThemeData",
  async (payload, { rejectWithValue }) => {
    let result = null;
    let params = null;

    if (payload?.keyword) {
      params = {
        keyword: payload.keyword
      }
    }

    try {
      const response = await axios.get("/theme", {
        params: params
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    if (result.item) {
      return result.item
    } else {
      return result;
    }
  }
);

/** 단일행 데이터 조회를 위한 비동기 함수 */
export const getItem = createAsyncThunk(
  "ThemeSlice/getItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(`map?theme=${payload.id}`);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    if (result.item) {
      return result.item
    } else {
      return result;
    }
  }
);

/** 데이터 저장을 위한 비동기 함수 */
export const postItem = createAsyncThunk(
  "ThemeSlice/postItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.post("/theme", {
        icon: payload.icon,
        text: payload.text,
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    if (result.item) {
      return result.item
    } else {
      return result;
    }
  }
);

/** 데이터 삭제를 위한 비동기 함수 */
export const deleteItem = createAsyncThunk(
  "ThemeSlice/deleteItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.delete(`map?theme=${payload.id}`);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    if (result.item) {
      return result.item
    } else {
      return result;
    }
  }
);

const ThemeSlice = createSlice({
  name: "ThemeSlice",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    getCurrentData: (state, action) => {
      return state;
    },
  },
  extraReducers: {
    /** 모든 장소 데이터를 불러오는 액션 함수 */
    [getThemeData.pending]: (state, {payload}) => {
      return { ...state, loading: true}
    },
    [getThemeData.fulfilled]: (state, {payload}) => {
      return { 
        data: payload,
        loading: false,
        error: null
      }
    },
    [getThemeData.rejected]: rejected,

    /** 단일행 데이터 조회를 위한 액션 함수 */
    [getItem.pending]: pending,
    [getItem.fulfilled]: fulfilled,
    [getItem.rejected]: rejected,

    /** 데이터 저장을 위한 액션 함수 */
    [postItem.pending]: pending,
    [postItem.fulfilled]: (state, { meta, payload}) => {
      const data = cloneDeep(state.data);
      console.log(data);

      data.push(payload);

      return {
        data: data,
        loading: false,
        error: null
      }
    },
    [postItem.rejected]: rejected,

    /** 데이터 삭제 위한 액션 함수 */
    [deleteItem.pending]: pending,
    [deleteItem.fulfilled]: fulfilled,
    [deleteItem.rejected]: rejected,
  },
});

export const { getCurrentData} = ThemeSlice.actions;
export default ThemeSlice.reducer;
