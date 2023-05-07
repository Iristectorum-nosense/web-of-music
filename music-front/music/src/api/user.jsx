import instance from './axios.jsx';

//重置个人信息
export const resetUserInfos = (data) => {
    const url = `user/resetInfos`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        nickname: data.nickname,
        gender: data.gender
    });
}

//喜欢歌曲
export const setLikeSong = (data) => {
    const url = `user/setLikeSong`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        songId: data.songId
    });
}

//获得喜欢单曲页信息
export const getLikeSong = (data) => {
    const url = `user/likeSong`;
    return instance.get(url, {
        params: {
            userId: data.userId,
            email: data.email,
            index: data.index
        }
    })
}

//删除喜欢歌曲
export const deleteLikeSong = (data) => {
    const url = `user/deleteLikeSong`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        songId: data.songId
    });
}

//喜欢专辑
export const setLikeAlbum = (data) => {
    const url = `user/setLikeAlbum`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        albumId: data.albumId
    });
}

//获得喜欢专辑页信息
export const getLikeAlbum = (data) => {
    const url = `user/likeAlbum`;
    return instance.get(url, {
        params: {
            userId: data.userId,
            email: data.email,
            index: data.index
        }
    })
}

//删除喜欢专辑
export const deleteLikeAlbum = (data) => {
    const url = `user/deleteLikeAlbum`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        albumId: data.albumId
    });
}

//喜欢MV
export const setLikeMV = (data) => {
    const url = `user/setLikeMV`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        mvId: data.mvId
    });
}

//获得喜欢MV页信息
export const getLikeMV = (data) => {
    const url = `user/likeMV`;
    return instance.get(url, {
        params: {
            userId: data.userId,
            email: data.email,
            index: data.index
        }
    })
}

//删除喜欢MV
export const deleteLikeMV = (data) => {
    const url = `user/deleteLikeMV`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        mvId: data.mvId
    });
}

//获得创建歌单页信息
export const getPlay = (data) => {
    const url = `user/play`;
    return instance.get(url, {
        params: {
            userId: data.userId,
            email: data.email,
            index: data.index
        }
    })
}

//创建歌单
export const createPlay = (data) => {
    const url = `user/createPlay`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        playName: data.playName
    });
}

//获得歌单详情页信息
export const getMyPlayInfo = (data) => {
    const url = `user/myPlayInfo`;
    return instance.get(url, {
        params: {
            userId: data.userId,
            email: data.email,
            playId: data.playId
        }
    })
}

//修改歌单
export const editPlay = (data) => {
    const url = `user/editPlay`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        playId: data.playId,
        playName: data.playName
    });
}

//获得歌单列表
export const getPlayList = (data) => {
    const url = `user/playList`;
    return instance.get(url, {
        params: {
            userId: data.userId,
            email: data.email
        }
    })
}

//收藏歌曲至歌单
export const setPlaySong = (data) => {
    const url = `user/setPlaySong`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        songIdList: data.songIdList,
        playId: data.playId
    });
}

//删除歌单歌曲
export const deletePlaySong = (data) => {
    const url = `user/deletePlaySong`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        songId: data.songId,
        playId: data.playId
    });
}

//删除歌单
export const deletePlay = (data) => {
    const url = `user/deletePlay`;
    return instance.post(url, {
        userId: data.userId,
        email: data.email,
        playId: data.playId
    });
}

