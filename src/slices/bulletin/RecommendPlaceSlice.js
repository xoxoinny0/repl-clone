import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pending, fulfilled, rejected } from '../../helper/ReduxHelper';
import axios from 'axios';

export const getMyPlace = createAsyncThunk('RecommendPlaceSlice/getMyPlace', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(process.env.REACT_APP_BULLETIN_PATH + '/myplace/' + payload);

        result = response.data;
    } catch (err) {
        result = rejectWithValue(err.response);
    }
        
    if (result.rtcode === 200) return result.item;
    return result.rtcode;
});

const RecommendPlaceSlice = createSlice({
    name: 'RecommendPlaceSlice',
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
        /** 추천할 장소(내가 리뷰한) 불러오가 */
        [getMyPlace.pending]: pending,
        [getMyPlace.fulfilled]: fulfilled,
        [getMyPlace.rejected]: rejected,
    }
});

export const { getCurrentData } = RecommendPlaceSlice.actions;
export default RecommendPlaceSlice.reducer;