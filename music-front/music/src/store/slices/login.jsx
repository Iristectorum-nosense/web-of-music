import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginByPw, loginByCap, register, resetPassword } from "../../api/login";
import cookie from 'react-cookies';
import { message } from "antd";

export const loginAction = createAsyncThunk('login/loginAction', async (payload) => {
    switch (payload.method) {
        case 'byPw':
            let pwToken = await loginByPw(null, 'get');
            let pwRes = {}
            if (Object.prototype.toString.call(pwToken) === '[object Object]') {
                await loginByPw(payload.data, 'post').then((res) => {
                    if (res.data.code === 405) {
                        message.error(res.data.message)
                    } else {
                        message.success('登录成功')
                        cookie.remove('csrftoken')
                        pwRes = res.data
                    }
                }).catch(() => { })
            }
            return pwRes;
        case 'byCap':
            let capToken = await loginByCap(null, 'get');
            let capRes = {}
            if (Object.prototype.toString.call(capToken) === '[object Object]') {
                await loginByCap(payload.data, 'post').then((res) => {
                    if (res.data.code === 405) {
                        message.error(res.data.message)
                    } else {
                        message.success('登录成功')
                        cookie.remove('csrftoken')
                        capRes = res.data
                    }
                }).catch(() => { })
            }
            return capRes;
        default: return;
    }
})

export const registerAction = createAsyncThunk('login/registerAction', async (payload) => {
    let token = await register(null, 'get');
    let response = {}
    if (Object.prototype.toString.call(token) === '[object Object]') {
        await register(payload, 'post').then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
            } else {
                message.success('注册成功')
                cookie.remove('csrftoken')
                response = res.data
            }
        }).catch(() => { })
    }
    return response;
})

export const resetPwAction = createAsyncThunk('login/resetPwAction', async (payload) => {
    let token = await resetPassword(null, 'get');
    let response = {}
    if (Object.prototype.toString.call(token) === '[object Object]') {
        await resetPassword(payload, 'post').then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
            } else {
                message.success('修改密码成功')
                cookie.remove('csrftoken')
                response = res.data
            }
        }).catch(() => { })
    }
    return response;
})

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        loginInfos: {
            userId: null,
            email: '',
            portrait: '',
            nickname: '',
            gender: null
        },
        captchaTime: {
            total: 0,
            count: 0,
            timerId: null,
        },
        captchaBtn: false
    },
    reducers: {
        clearUserInfo(state) {
            state.loginInfos = {
                userId: null,
                email: '',
                portrait: '',
                nickname: '',
                gender: null
            }
        },
        resetUserInfo(state, action) {
            state.loginInfos.nickname = action.payload.nickname
            state.loginInfos.gender = action.payload.gender
        },
        setCaptchaTime(state, action) {
            if (state.captchaTime.timerId) {  //必须写,因为重渲染会导致定时器被覆盖,而未清除
                clearInterval(state.captchaTime.timerId);
            }
            state.captchaTime = action.payload
        },
        subCaptchaTime(state) {
            state.captchaTime.count = state.captchaTime.count - 1
        },
        stopCaptchaTime(state) {
            clearInterval(state.captchaTime.timerId);
            state.captchaTime = {
                total: 0,
                count: 0,
                timerId: null
            }
        },
        changeCapBtn(state, action) {
            state.captchaBtn = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginAction.fulfilled, (state, action) => {
            if (JSON.stringify(action.payload) !== '{}') {
                state.loginInfos = action.payload.loginInfos
            }
        })
    }
})

export const { clearUserInfo, resetUserInfo,
    setCaptchaTime, subCaptchaTime, stopCaptchaTime, changeCapBtn } = loginSlice.actions;

export default loginSlice.reducer;