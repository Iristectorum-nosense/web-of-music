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

//获得专辑详情页信息
export const getAlbumInfo = (data) => {
    const url = `albumInfo`;
    return instance.get(url, {
        params: {
            id: data
        }
    })
}