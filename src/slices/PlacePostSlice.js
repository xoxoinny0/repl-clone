import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { pending, fulfilled, rejected } from '../helper/ReduxHelper';

export const getPost = createAsyncThunk("PlacePostSlice/getPost", async (payload, { rejectWithValue }) => {
    let result = [];
    const URL = process.env.REACT_APP_PLACE_POST;
    const { place_id } = payload;
    
try {
        let response = await axios.get(`${URL}?place_id=${place_id}`);
        const arr = [];
        if (response?.data?.item) {
            response.data.item.map(v => {
                arr.push(v.bulletin_id);
            });
        } else {
            response?.data.map(v => {
                arr.push(v.bulletin_id);
            });
        }

        let posts = [];
        for (const k of arr) {
            response = await axios.get(`/bulletin?id=${k}`);    
            if (response?.data?.item) {
                posts.push(response.data.item);
            } else {
                posts = response.data;
            }
        }

        result = posts;
    } catch (err) {
        return (rejectWithValue(err.response));
    }

    return result;
});

const PlacePostSlice = createSlice({
    name: 'PlacePostSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    extraReducers: {
        [getPost.pending]: pending,
        [getPost.fulfilled]: fulfilled,
        [getPost.rejected]: rejected
    }
});

export default PlacePostSlice.reducer;