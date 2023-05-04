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