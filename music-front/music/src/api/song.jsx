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

//获取歌手页歌曲信息
export const getSingerSong = (data) => {
    const url = `singerSong`;
    return instance.get(url, {
        params: {
            id: data.id,
            index: data.index
        }
    })
}