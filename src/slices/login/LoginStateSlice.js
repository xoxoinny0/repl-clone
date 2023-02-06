import { createSlice } from '@reduxjs/toolkit'

const LoginStateSlice = createSlice({
    name: 'LoginStateSlice',
    initialState: {
        isLogined: false,
    },
    reducers: {
        getLoginState: (state, action) => {
            let isLogin = action.payload;
            console.log("isLogin", isLogin);
            return { isLogined: isLogin };
        }
    },
    
});

export const { getLoginState } = LoginStateSlice.actions;

export default LoginStateSlice.reducer;