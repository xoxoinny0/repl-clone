/**
 * bookmark 데이터 슬라이스 - 장윤신
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";
import { cloneDeep } from "lodash";

/** 특정 유저의 bookmark 데이터를 불러오는 비동기 함수 */
export const getBookmarkList = createAsyncThunk("BookmarkSlice/getBookmarkList", async (payload, { rejectWithValue }) => {
  const URL = "/bookmark?user_id=" + payload.user_id;

  let result = null;

  try {
    const response = await axios.get(URL);
    result = response.data;
  } catch (err) {
    result = rejectWithValue(err.response);
  }

  if (result.item) return result.item;
  else return result;
});

/** 특정 유저 + 특정 장소 bookmark 데이터를 불러오는 비동기 함수 */
export const getBookmarkItem = createAsyncThunk("BookmarkSlice/getBookmarkItem", async (payload, { rejectWithValue }) => {
  const URL = "/bookmark?user_id=" + payload.user_id + "&place_id=" + payload.place_id;

  let result = null;

  try {
    const response = await axios.get(URL);
    result = response.data;
  } catch (err) {
    result = rejectWithValue(err.response);
  }

  if (result.item) return result.item;
  else return result;
});

/** bookmark 저장을 위한 비동기 함수 */
export const postBookmark = createAsyncThunk("BookmarkSlice/postBookmark", async (payload, { rejectWithValue }) => {
  const URL = "/bookmark";

  let user_id = 0; // 임시 유저 아이디
  if (payload.user_id) {
    user_id = payload.user_id;
  }

  let result = null;

  try {
    const response = await axios.post(URL, {
      place_id: +payload.place_id,
      user_id: user_id,
    });
    result = response.data;
  } catch (err) {
    result = rejectWithValue(err.response);
  }
  
  if (result.item) return result.item;
  else return result;
});

/** bookmark 삭제를 위한 비동기 함수 */
export const delBookmark = createAsyncThunk("BookmarkSlice/delBookmark", async (payload, { rejectWithValue }) => {
  let result = null;

  const URL = "/bookmark/" + payload.index;

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

const BookmarkSlice = createSlice({
  name: "BookmarkSlice",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    /** 특정 유저의 bookmark 데이터를 불러오기 위한 액션 함수 */
    [getBookmarkList.pending]: pending,
    [getBookmarkList.fulfilled]: fulfilled,
    [getBookmarkList.rejected]: rejected,

    /** 특정 유저 + 특정 장소 bookmark 데이터를 불러오기 위한 액션 함수 */
    [getBookmarkItem.pending]: pending,
    [getBookmarkItem.fulfilled]: fulfilled,
    [getBookmarkItem.rejected]: rejected,

    /** bookmark 저장을 위한 액션 함수 */
    [postBookmark.pending]: pending,
    [postBookmark.fulfilled]: (state, { meta, payload }) => {
      const data = cloneDeep(state.data);
      data?.push(payload);
      return {
        data: data,
        loading: false,
        error: null,
      };
    },
    [postBookmark.rejected]: rejected,

    /** bookmark 삭제를 위한 액션 함수 */
    [delBookmark.pending]: pending,
    [delBookmark.fulfilled]: (state, { meta, payload }) => {
      const data = cloneDeep(state.data);
      const targetId = data.findIndex((v, i) => v.id == meta.arg.id);
      data.splice(targetId, 1);
      return {
        data: data,
        loading: false,
        error: null,
      };
    },
    [delBookmark.rejected]: rejected,
  },
});

export default BookmarkSlice.reducer;
