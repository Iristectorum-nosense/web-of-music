import instance from './axios.jsx';

//获取歌曲榜单信息
export const getRankList = (data) => {
    const url = `rankList`;
    return instance.get(url, {
        params: {
            top: data
        }
    })
}