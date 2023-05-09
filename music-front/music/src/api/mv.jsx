import instance from './axios.jsx';

//获取MV查询页信息
export const getMVList = (data) => {
    const url = `mvList`;
    return instance.get(url, {
        params: {
            version: data.version,
            order: data.order,
            offset: data.offset,
            limit: data.limit
        }
    })
}

//获取歌手页MV信息
export const getSingerMV = (data) => {
    const url = `singerMV`;
    return instance.get(url, {
        params: {
            id: data.id,
            index: data.index
        }
    })
}

//获取MV详情页信息
export const getMVInfo = (data) => {
    const url = `MVInfo`;
    return instance.get(url, {
        params: {
            id: data
        }
    })
}

//MV播放次数
export const setPlayMVCount = (data) => {
    const url = `play/playMVCount`;
    return instance.post(url, {
        playId: data
    })
}