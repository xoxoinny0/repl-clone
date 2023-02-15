import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { pending, fulfilled, rejected } from '../helper/ReduxHelper';
import { cloneDeep } from 'lodash';

export const getComment = createAsyncThunk("PlaceCommentSlice/getComment", async (payload, { rejectWithValue }) => {
    let result = null;
    const URL = process.env.REACT_APP_PLACE_REVIEW;
    const { place_id } = payload;
    
    try {
        const response = await axios.get(`${URL}?place_id=${place_id}`);
        result = response.data;
    } catch (err) {
        return (rejectWithValue(err.response));
    }

    if (result?.item) return result.item;
    else return result;
});

export const addComment = createAsyncThunk("PlaceCommentSlice/addComment", async (payload, { rejectWithValue }) => {
    let result = null;
    const URL = process.env.REACT_APP_PLACE_REVIEW;
    const { user_id, place_id, rating, content } = payload;

    try {
        const response = await axios.post(`${URL}`, {
            user_id: +user_id,
            place_id: +place_id,
            rating: +rating,
            content: content
        });

        result = response.data;
    } catch (err) {
        return (rejectWithValue(err.response));
    }

    if (result?.item) return result.item;
    else return result;
});

const PlaceCommentSlice = createSlice({
    name: 'PlaceCommentSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    extraReducers: {
        [getComment.pending]: pending,
        [getComment.fulfilled]: fulfilled,
        [getComment.rejected]: rejected,

        [addComment.pending]: pending,
        [addComment.fulfilled]: (state, { payload }) => {
            let data = cloneDeep(state.data);
            if (!data) return;
            data.push(payload);
            return {
                data: data,
                loading: false,
                error: null,
            };
        },
        [addComment.rejected]: rejected,
    }
});

export default PlaceCommentSlice.reducer;