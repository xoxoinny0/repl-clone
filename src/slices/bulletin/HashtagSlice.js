import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pending, fulfilled, rejected } from '../../helper/ReduxHelper';
import axios from 'axios';

export const getTags = createAsyncThunk('HashtagSlice/getTags', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get('/categories');

        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    if (result.item) return result.item;
    else return result;
});

export const getPostsTags = createAsyncThunk('HashtagSlice/getPostsTags', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(process.env.REACT_APP_BULLETIN_PATH + '/getTags/' + payload);

        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    if (result.rtcode === 200) return result.item;
    return result.rtmsg;
});

const HashtagSlice = createSlice({
    name: 'HashtagSlice',
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
        /** 태그 가져오기 */
        [getTags.pending]: pending,
        [getTags.fulfilled]: fulfilled,
        [getTags.rejected]: rejected,

        /** 게시물에 선택된 태그들 가져오기 */
        [getPostsTags.pending]: pending,
        [getPostsTags.fulfilled]: fulfilled,
        [getPostsTags.rejected]: rejected,
    }
});

export const { getCurrentData } = HashtagSlice.actions;
export default HashtagSlice.reducer;