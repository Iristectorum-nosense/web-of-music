import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginByPw, checkJWT } from "../../api/login";
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

export const checkJWTAction = createAsyncThunk('user/checkJWTAction', async (payload) => {
    let token = await checkJWT(null, 'get');
    let response = false
    if (Object.prototype.toString.call(token) === '[object Object]') {
        await checkJWT(payload, 'post').then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
            } else {
                response = true
            }
        }).catch(() => { })
    }
    return response;
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loginInfos: {
            userId: null,
            email: '',
            portrait: ''
        }
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(loginAction.fulfilled, (state, action) => {
            if (JSON.stringify(action.payload) !== '{}') {
                state.loginInfos = action.payload.loginInfos
            }
        })
        builder.addCase(checkJWTAction.fulfilled, (state, action) => {
            // if (!action.payload) {
            //     console.log(state.initialState)
            //     state.loginInfos = state.initialState
            // }
        })
    }
})

export const { login } = userSlice.actions;

export default userSlice.reducer;