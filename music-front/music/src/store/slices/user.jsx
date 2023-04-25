// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserInfos } from "../../api/user";
// import cookie from 'react-cookies';
// import { message } from "antd";

// export const getUserInfosAction = createAsyncThunk('user/getUserInfosAction', async (payload) => {
//     let response = {};
//     await getUserInfos(payload).then((res) => {
//         if (res.data.code === 405) {
//             message.error(res.data.message)
//         } else {
//             response = res.data
//         }
//     }).catch(() => { })
//     return response;
// })

// const userSlice = createSlice({
//     name: 'user',
//     initialState: {
//         userInfos: {
//             nickName: '',
//             gender: ''
//         }
//     },
//     reducers: {
//         clearUserInfo(state) {
//             state.userInfos = {
//                 nickName: '',
//                 gender: ''
//             }
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(getUserInfosAction.fulfilled, (state, action) => {
//             if (JSON.stringify(action.payload) !== '{}') {
//                 state.userInfos = action.payload.userInfos
//             }
//         })
//     }
// })

// export const { clearUserInfo } = userSlice.actions;

// export default userSlice.reducer;