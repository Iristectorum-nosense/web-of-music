import instance from './axios.jsx';

//获取歌曲榜单信息
export const getHome = () => {
    const url = `home`;
    return instance.get(url)
}