import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { pending, fulfilled, rejected } from '../helper/ReduxHelper';

export const getPlacePhotos = createAsyncThunk('PlacePhotoSlice/getPlacePhotos', async (payload, { rejectWithValue }) => {
    let data = null;

    const { placeId } = payload;

    try {
        const response = await axios.get(`/placePhoto/${placeId}`);
        data = response.data;
    } catch (err) {
        return rejectWithValue(err.response);
    }

    return data;
});

export const addPlacePhotos = createAsyncThunk('PlacePhotoSlice/addPlacePhotos', async (payload, { rejectWithValue }) => {
    let data = null;
    const { userId, username, placeId, files } = payload;

    const formData = new FormData();
    files.forEach(v => {
        formData.append("customPhoto", v);
    });
    formData.append("username", username);

    try {
        let response = await axios.post("/upload/multiple", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        let fileNames = [];
        for (const k of response.data) {
            fileNames.push(k.savename);
        }

        response = await axios.post(`/placePhoto`, {
            userId: userId,
            placeId: placeId,
            files: fileNames
        });
        data = response.data;
    } catch (err) {
        return rejectWithValue(err.response);
    }

    console.log(data);
    return data;
});

const PlacePhotoSlice = createSlice({
    name: 'PlacePhotoSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    extraReducers: {
        [getPlacePhotos.pending]: pending,
        [getPlacePhotos.fulfilled]: fulfilled,
        [getPlacePhotos.rejected]: rejected,

        [addPlacePhotos.pending]: pending,
        [addPlacePhotos.fulfilled]: fulfilled,
        [addPlacePhotos.rejected]: rejected,
    }
});

export default PlacePhotoSlice.reducer;