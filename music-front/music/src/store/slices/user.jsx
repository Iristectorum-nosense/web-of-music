import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cookie from 'react-cookies';
import { message } from "antd";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfos: {
            userId: null,
            nickName: '',
            gender: ''
        }
    },
    reducers: {
        clearUserInfo(state) {
            state.userInfos = {
                userId: null,
                nickName: '',
                gender: ''
            }
        },
    },
    extraReducers: (builder) => {
    }
})

export const { clearUserInfo } = userSlice.actions;

export default userSlice.reducer;