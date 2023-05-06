import instance from './axios.jsx';

//重置个人信息
export const resetUserInfos = (data) => {
    const url = `user/resetInfos`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        nickname: data.nickname,
        gender: data.gender
    });
}