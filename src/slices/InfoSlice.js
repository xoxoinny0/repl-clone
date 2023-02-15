import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";

const API_URL = process.env.REACT_APP_INFO_API_URL;

export const getInfo = createAsyncThunk('InfoSlice/getInfo', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(API_URL);
        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    return result;
});

const InfoSlice = createSlice({
    name: 'InfoSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: {
        [getInfo.pending]: (state, { payload }) => {
            return { ...state, loading: true }
        },
        [getInfo.fulfilled]: fulfilled,
        [getInfo.rejected]: rejected
    },
});

export default InfoSlice.reducer;