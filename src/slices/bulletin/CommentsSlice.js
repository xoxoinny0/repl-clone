import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pending, fulfilled, rejected } from '../../helper/ReduxHelper';
import axios from 'axios'

export const getComments = createAsyncThunk('CommentsSlice/getComments', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(process.env.REACT_APP_BULLETIN_PATH + '/comments/' + payload);

        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    if (result.rtcode === 200) {
        return result.item;
    }

    return result.rtmsg;
});

export const postComment = createAsyncThunk('CommentsSlice/postComment', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.post(process.env.REACT_APP_BULLETIN_PATH + '/comments/' + payload.id, payload);

        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    return result;
});

const CommentsSlice = createSlice({
    name: 'CommentsSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    extraReducers: {
        [getComments.pending]: pending,
        [getComments.fulfilled]: fulfilled,
        [getComments.rejected]: rejected,
    }
});

export default CommentsSlice.reducer;