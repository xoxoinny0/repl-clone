import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";

const API_URL = process.env.REACT_APP_INTEREST_API_URL;

export const getInterest = createAsyncThunk('InterestSlice/getInterest', async (payload, { rejectWithValue }) => {
    let result = null;
    try {
        const response = await axios.get(API_URL);
        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    return result;
});

const InterestSlice = createSlice({
    name: 'InterestSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: {
        [getInterest.pending]: (state, { payload }) => {
            return { ...state, loading: true }
        },
        [getInterest.fulfilled]: fulfilled,
        [getInterest.rejected]: rejected
    },
});

export default InterestSlice.reducer;