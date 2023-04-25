import instance from './axios.jsx';

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