import instance from './axios.jsx';

//获取歌手查询页信息
export const getSingerList = (data) => {
    const url = `singerList`;
    return instance.get(url, {
        params: {
            alphabet: data.alphabet,
            area: data.area,
            gender: data.gender,
            genre: data.genre,
            offset: data.offset,
            limit: data.limit
        }
    })
}

//获得歌手详情页公共信息
export const getSingerInfo = (data) => {
    const url = `singerInfo`;
    return instance.get(url, {
        params: {
            id: data
        }
    })
}

//获得歌手详情页默认信息
export const getSingerDefault = (data) => {
    const url = `singerDefault`;
    return instance.get(url, {
        params: {
            id: data
        }
    })
}