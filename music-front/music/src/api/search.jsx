import instance from './axios.jsx';

//获取搜索框实时查询信息
export const getSearchBar = (data) => {
    const url = `searchBar`;
    return instance.get(url, {
        params: {
            info: data
        }
    })
}

//获取搜索页查询信息
export const getSearch = (data) => {
    const url = `search`;
    return instance.get(url, {
        params: {
            type: data.type,
            info: data.info
        }
    })
}