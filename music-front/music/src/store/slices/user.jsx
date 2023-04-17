import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginByPw } from "../../api/login";
import { message } from "antd";

export const loginAction = createAsyncThunk('user/loginAction', async (payload) => {
    switch (payload.method) {
        case 'byPw':
            let token = await loginByPw(null, 'get');
            let response = {}
            if (Object.prototype.toString.call(token) === '[object Object]') {
                await loginByPw(payload.data, 'post').then((res) => {
                    if (res.data.code === 405) {
                        message.error(res.data.message)
                    } else {
                        message.success('登录成功')
                        response = res.data
                    }
                }).catch(() => { })
            }
            return response;
        default:
        case 'byCap':
            console.log('byCap')
            break;
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loginInfos: {}
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(loginAction.fulfilled, (state, action) => {
            if (JSON.stringify(action.payload) !== '{}') {
                state.loginInfos = action.payload.loginInfos
            }
        })
    }
})

export const { login } = userSlice.actions;

export default userSlice.reducer;