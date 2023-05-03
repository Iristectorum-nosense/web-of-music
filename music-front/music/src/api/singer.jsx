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