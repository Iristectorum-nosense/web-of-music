import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { getPlayListInfo, getSingerSong } from "../../api/song";

export const playSingerSongAction = createAsyncThunk('user/playSingerSongAction', async (payload, { getState, dispatch }) => {

    const { login, user } = getState()
    const loginInfos = login.loginInfos
    const playInfoList = user.playList

    let info = {
        id: payload,
        index: 1
    }

    let res = await getSingerSong(info)

    if (res.data.code === 200) {
        const playIdList = []
        res.data.singerSong.songs.map((song) => { playIdList.push(song.id) })
        const newPlayIdList = playIdList.filter(id => !playInfoList.some(playInfo => playInfo.id === id))
        if (newPlayIdList.length === 0) {
            if (playIdList.length !== 0) dispatch(setPlayIndex(playInfoList.findIndex(playInfo => playInfo.id === playIdList[0])))
        } else {
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playIdList: newPlayIdList
            }
            getPlayListInfo(payload).then((res) => {
                if (res.data.code === 200) {
                    message.success('添加成功')
                    dispatch(addPlaySong(res.data.playInfoList))
                } else if (res.data.code === 405) message.error(res.data.message)
            }).catch(() => { })
        }
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        playList: [],
        playIndex: -1,
        playProgress: -1,
        playMode: 1,  //1是顺序播放,2是列表循环,3是单曲循环,4是随机播放
        lyric: []
    },
    reducers: {
        addPlaySong(state, action) {
            if (state.playList.length === 0) {
                const newPlayList = [...action.payload]
                state.playList = newPlayList
                state.playIndex = 0
            } else {
                const newPlayList = [...state.playList];
                newPlayList.splice(state.playIndex + 1, 0, ...action.payload);
                state.playList = newPlayList;
                state.playIndex = state.playIndex + 1
            }
        },
        setPlayIndex(state, action) {
            if (state.playMode === 1 && action.playIndex + 1 === state.playList.length && action.payload === 0) state.playProgress = -1
            else state.playProgress = 0
            state.playIndex = action.payload
        },
        deletePlaySong(state, action) {
            if (state.playIndex === action.payload) state.playProgress = 0
            const newPlayList = [...state.playList];
            newPlayList.splice(action.payload, 1);
            if (state.playIndex === action.payload && state.playList.length === action.payload + 1) state.playIndex = state.playIndex - 1
            if (state.playIndex > action.payload) state.playIndex = state.playIndex - 1
            state.playList = newPlayList
        },
        clearPlaySong(state) {
            state.playList = []
            state.playIndex = -1
            state.playProgress = -1
            state.lyric = []
        },
        setPlayMode(state, action) {
            state.playMode = action.payload
        },
        modifyLike(state, action) {
            const newPlayList = state.playList.map((play) =>
                play.id === action.payload ? {
                    ...play,
                    isLike: !play.isLike
                } : { ...play }
            )
            state.playList = newPlayList
        },
        setPlayProgress(state, action) {
            state.playProgress = action.payload
        },
        setLyric(state, action) {
            state.lyric = action.payload
        }
    }
})

export const { addPlaySong, setPlayIndex, deletePlaySong, clearPlaySong, setPlayMode, modifyLike, setPlayProgress, setLyric } = userSlice.actions;

export default userSlice.reducer;