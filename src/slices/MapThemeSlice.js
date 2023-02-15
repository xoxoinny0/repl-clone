/**
 * theme_place 데이터 슬라이스 - 장윤신
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";
import { cloneDeep } from "lodash";

/** theme_place 데이터를 불러오는 비동기 함수 */
export const getTP = createAsyncThunk("MapThemeSlice/getTP", async (payload, { rejectWithValue }) => {
  let result = null;
  try {
    const response = await axios.get("/theme_place");
    result = response.data;
  } catch (err) {
    result = rejectWithValue(err.response);
  }

  if (result.item) {
    return result.item
  } else {
    return result;
  }
});

/** 특정 유저가 작성한 데이터만을 불러오는 비동기 함수 */
export const getUserTP = createAsyncThunk("MapThemeSlice/getUserTP", async (payload, { rejectWithValue }) => {
  let result = null;

  const URL = "/theme_place?user_id=" + payload.user_id;
  try {
    const response = await axios.get(URL);
    result = response.data;
  } catch (err) {
    result = rejectWithValue(err.response);
  }
  if (result.item) return result.item;
  else return result;
});

/** theme_place 저장을 위한 비동기 함수 */
export const postTP = createAsyncThunk("MapThemeSlice/postTP", async (payload, { rejectWithValue }) => {
  let result = null;
  const URL = "/theme_place";

  try {
    const response = await axios.post(URL, {
      user_id: +payload.user_id,
      place_id: +payload.place_id,
      theme_id: +payload.theme_id,
      user_id: +payload.user_id,
    });
    result = response.data;
  } catch (err) {
    result = rejectWithValue(err.response);
  }

  if (result.item) return result.item;
  else return result;
});

/** theme_place 데이터 삭제를 위한 비동기 함수 */
export const deleteTP = createAsyncThunk("MapThemeSlice/deleteTP", async (payload, { rejectWithValue }) => {
  let result = null;
  const URL = "/theme_place/" + payload.index;

  try {
    console.log(URL);
    const response = await axios.delete(URL);
    result = response.data;
  } catch (err) {
    result = rejectWithValue(err.response);
  }

  if (result.item) return result.item;
  else return result;
});

const MapThemeSlice = createSlice({
  name: "MapThemeSlice",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    /** theme_place 데이터를 불러오는 액션 함수 */
    [getTP.pending]: pending,
    [getTP.fulfilled]: fulfilled,
    [getTP.rejected]: rejected,

    /** 특정 유저가 작성한 데이터만을 불러오는 액션 함수 */
    [getUserTP.pending]: pending,
    [getUserTP.fulfilled]: fulfilled,
    [getUserTP.rejected]: rejected,

    /** theme_place 저장을 위한 액션 함수 */
    [postTP.pending]: pending,
    [postTP.fulfilled]: (state, { meta, payload }) => {
      const data = cloneDeep(state.data);
      data.push(payload);
      return {
        data: data,
        loading: false,
        error: null,
      };
    },
    [postTP.rejected]: rejected,

    /** 데이터 삭제를 위한 액션 함수 */
    [deleteTP.pending]: pending,
    [deleteTP.fulfilled]: (state, { meta, payload }) => {
      const data = cloneDeep(state.data);
      const targetId = data.findIndex((v, i) => v.id == meta.arg.id);
      // console.log(targetId);
      data.splice(targetId, 1);
      return {
        data: data,
        loading: false,
        error: null,
      };
    },
    [deleteTP.rejected]: rejected,
  },
});

export default MapThemeSlice.reducer;
