import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pending, fulfilled, rejected } from '../../helper/ReduxHelper';
import axios from 'axios';

export const getRecommendedPlaces = createAsyncThunk('RecommendedPlaceSlice/getRecommendedPlaces', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(process.env.REACT_APP_BULLETIN_PATH + '/places/' + payload);

        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }

    if (result.rtcode === 200) {
        return result.item;
    }

    return result.rtmsg;
});

const RecommendedPlaceSlice = createSlice({
    name: 'RecommendedPlaceSlice',
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    extraReducers: {
        /** 추천할 장소(내가 리뷰한) 불러오가 */
        [getRecommendedPlaces.pending]: pending,
        [getRecommendedPlaces.fulfilled]: fulfilled,
        [getRecommendedPlaces.rejected]: rejected,
    }
});

export default RecommendedPlaceSlice.reducer;