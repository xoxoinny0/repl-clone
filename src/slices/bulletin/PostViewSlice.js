import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pending, fulfilled, rejected } from '../../helper/ReduxHelper';
import axios from 'axios'

export const getPost = createAsyncThunk('PostViewSlice/getPost', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(process.env.REACT_APP_BULLETIN_PATH + '/' + payload);

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

const PostViewSlice = createSlice({
    name: 'PostViewSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    reducers: {
        getCurrentData: (state, action) => {
            return state;
        }
    },
    extraReducers: {
        /** 단일 게시물 데이터 가져오기 */
        [getPost.pending]: pending,
        [getPost.fulfilled]: fulfilled,
        [getPost.rejected]: rejected,
    }
});

export const { getCurrentData } = PostViewSlice.actions;
export default PostViewSlice.reducer;