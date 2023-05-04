import instance from './axios.jsx';

//获取歌手页专辑信息
export const getSingerAlbum = (data) => {
    const url = `singerAlbum`;
    return instance.get(url, {
        params: {
            id: data.id,
            index: data.index
        }
    })
}