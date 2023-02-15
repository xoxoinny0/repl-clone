import { createSlice } from '@reduxjs/toolkit'

const LoginStateSlice = createSlice({
    name: 'LoginStateSlice',
    initialState: {
        isLogined: false,
        loginInfo: null,
    },
    reducers: {
        getLoginState: (state, action) => {
            let isLogin = action.payload;
            console.log("isLogin", isLogin);
            return { ...state, isLogined: isLogin };
        },
        getLoginInfo: (state, action) => { 
            let infoData = action.payload;
            return { ...state, loginInfo: infoData}
        }

    },
    
});

export const { getLoginState, getLoginInfo } = LoginStateSlice.actions;

export default LoginStateSlice.reducer;