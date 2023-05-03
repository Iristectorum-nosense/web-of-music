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