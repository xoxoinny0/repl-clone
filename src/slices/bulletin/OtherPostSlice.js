import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { pending, fulfilled, rejected } from '../../helper/ReduxHelper';

export const getOtherPosts = createAsyncThunk('OtherPostSlice/getOtherPosts', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(process.env.REACT_APP_BULLETIN_PATH + '/otherPosts/' + payload);

        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    if (result.rtcode === 200) {
        return result.item;
    }

    return result.rtmsg;
});

const OtherPostSlice = createSlice({
    name: 'OtherPostSlice',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    extraReducers: {
        [getOtherPosts.pending]: pending,
        [getOtherPosts.fulfilled]: fulfilled,
        [getOtherPosts.rejected]: rejected
    }
});

export default OtherPostSlice.reducer;