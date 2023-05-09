import React, { useEffect, useRef, useState } from 'react';
import cookie from 'react-cookies';
import './AudioPlayer.scss';
import { Button } from 'antd';
import {
    StepBackwardOutlined, PlayCircleOutlined, StepForwardOutlined, PauseOutlined, FastForwardOutlined, FastBackwardOutlined,
    HeartFilled, HeartOutlined, SoundOutlined, BarsOutlined, MenuUnfoldOutlined, RetweetOutlined, RedoOutlined, NodeIndexOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useClickNavigate } from '../Hooks/useClickNavigate';
import { formatPlayTime, formatScrollLyric, formatSeconds, formatTime } from '../../../utils/format';
import { clearPlaySong, deletePlaySong, modifyLike, setLyric, setPlayIndex, setPlayMode, setPlayProgress } from '../../../store/slices/user';
import { modifyLikeSong } from '../../../api/user';
import { throttleDelay } from '../../../utils/throttle';
import { getLyric, setPlaySongCount } from '../../../api/song';
import { SongImgURL, SongLyricURL, SongMp3URL } from '../../../utils/staticURL';

export default function AudioPlayer() {

    const token = cookie.load('jwtToken')

    const playList = useSelector((state) => state.user.playList)
    const playIndex = useSelector((state) => state.user.playIndex)
    const playMode = useSelector((state) => state.user.playMode)
    const playProgress = useSelector((state) => state.user.playProgress)
    const lyric = useSelector((state) => state.user.lyric)
    const loginInfos = useSelector((state) => state.login.loginInfos)

    const dispatch = useDispatch()

    const [playing, setPlaying] = useState(false)
    const [playVisible, setPlayVisible] = useState(false)
    const [inputProgress, setInputProgress] = useState(playProgress)
    const [volume, setVolume] = useState(100)
    const [volumeVisible, setVolumeVisble] = useState(false)

    const audioRef = useRef(null)
    const playListRef = useRef(null)
    const playSongRef = useRef(null)
    const playTimeRef = useRef()
    const lyricRef = useRef(null)
    const lineRef = useRef(null)

    const { handleSongClick, handleSingerClick } = useClickNavigate()

    const handlePlayPause = throttleDelay((playing) => {
        setPlaying(playing)
        if (playing) {
            if (playProgress === -1) dispatch(setPlayProgress(0))
            else {
                startPlayTimer()
                audioRef.current.play()
            }
        } else {
            if (playProgress === 0) dispatch(setPlayProgress(-1))
            else {
                clearInterval(playTimeRef.current)
                audioRef.current.pause()
            }
        }
    }, 300)

    const handlePrev = throttleDelay(() => {
        switch (playMode) {
            case 1:
            case 2:
                if (playIndex === 0) dispatch(setPlayIndex(playList.length - 1))
                else dispatch(setPlayIndex(playIndex - 1))
                break
            case 3:
                dispatch(setPlayIndex(playIndex))
                break
            case 4:
                let randomIndex = Math.floor(Math.random() * playList.length)
                while (playIndex === randomIndex) {
                    randomIndex = Math.floor(Math.random() * playList.length)
                }
                dispatch(setPlayIndex(randomIndex))
                break
            default: break;
        }
    }, 1000)

    const handleNext = throttleDelay(() => {
        switch (playMode) {
            case 1:
            case 2:
                if (playIndex + 1 === playList.length) dispatch(setPlayIndex(0))
                else dispatch(setPlayIndex(playIndex + 1))
                break
            case 3:
                dispatch(setPlayIndex(playIndex))
                break
            case 4:
                let randomIndex = Math.floor(Math.random() * playList.length)
                while (playIndex === randomIndex) {
                    randomIndex = Math.floor(Math.random() * playList.length)
                }
                dispatch(setPlayIndex(randomIndex))
                break
            default: break;
        }
    }, 1000)

    const handleFastPrev = throttleDelay(() => {
        clearInterval(playTimeRef.current)
        startPlayTimer(audioRef.current.currentTime - 15)
        if (!playing) {
            setPlaying(true)
            audioRef.current.play()
        }
    }, 1000)

    const handleFastNext = throttleDelay(() => {
        clearInterval(playTimeRef.current)
        startPlayTimer(audioRef.current.currentTime + 15)
        if (!playing) {
            setPlaying(true)
            audioRef.current.play()
        }
    }, 1000)

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value)
        setInputProgress(value)
    }

    const handleInputMouseUp = (e) => {
        clearInterval(playTimeRef.current)
        const value = parseInt(e.target.value)
        dispatch(setPlayProgress(value))
        setPlaying(true)

        if (value) {
            startPlayTimer(value)
            if (!playing) audioRef.current.play()
        }
    }

    const handleDelete = (index) => {
        dispatch(deletePlaySong(index))
    }

    const handleClear = () => {
        dispatch(clearPlaySong())
        setPlayVisible(false)
        setVolumeVisble(false)
    }

    const handleOnePlay = (index) => {
        dispatch(setPlayIndex(index))
    }

    const handleFavor = async (id) => {
        if (token) {
            let payload = {
                userId: loginInfos.userId,
                email: loginInfos.email,
                playId: id
            }
            await modifyLikeSong(payload)
        }
        dispatch(modifyLike(id))
    }

    const playCount = async () => {
        await setPlaySongCount(playList[playIndex].id)
    }

    const playLyric = () => {
        getLyric(SongLyricURL(playList[playIndex].id)).then((res) => {
            if (res.status === 200) {
                dispatch(setLyric(formatScrollLyric(res.data)))
            }
        })
    }

    const startPlayTimer = (value) => {

        if (value) {  // 如果由进度条或切换触发,那么设置为进度条的值或初始化,dispatch设置共享状态有时间差
            audioRef.current.currentTime = parseInt(value)
        } else {  // 如果由暂停播放按钮触发,那么设置为共享状态中的播放进度
            audioRef.current.currentTime = playProgress
        }

        playTimeRef.current = setInterval(() => {
            console.log('timer', audioRef.current.duration, audioRef.current.currentTime)
            setInputProgress(audioRef.current.currentTime)
            dispatch(setPlayProgress(audioRef.current.currentTime))
            if (audioRef.current.ended) {  // 播放结束时
                if (playMode === 1 && playIndex + 1 === playList.length) {  // 顺序播放且播放至最后一首
                    setInputProgress(0)
                    setPlaying(false)
                    clearInterval(playTimeRef.current)
                    audioRef.current.pause()
                }
                handleNext()
            }
        }, 1000)
    }

    // 初始化播放
    useEffect(() => {
        if (playList.length !== 0) {
            const audioSrc = SongMp3URL(playList[playIndex].url, playList[playIndex].id)
            audioRef.current = new Audio(audioSrc)

        }

        return () => {
            setPlayVisible(false)
            if (audioRef.current) audioRef.current.pause()
            clearInterval(playTimeRef.current)
        }
    }, []);

    useEffect(() => {
        // 不用playIndex是因为
        //1.playIndex和playProgress共存时,执行有先后,会造成play()出错
        //2.点击播放等按钮时,playIndex不能触发播放,且初始化为-1时易造成麻烦

        if (playProgress === 0) {
            playCount()
            playLyric()

            setPlaying(false)
            clearInterval(playTimeRef.current)
            audioRef.current.pause()

            const audioSrc = SongMp3URL(playList[playIndex].url, playList[playIndex].id)
            audioRef.current = new Audio(audioSrc)
            setInputProgress(0)
            startPlayTimer('0')
            audioRef.current.play()
            setPlaying(true)
        }

        return () => {
            if (playProgress === 0) dispatch(setPlayProgress(-1))
        }
    }, [playProgress]);

    useEffect(() => {
        if (playList && playList[playIndex]) {
            const playContainer = playListRef.current
            const curPlaySong = playSongRef.current.getBoundingClientRect()  // 当前播放歌曲的位置
            const scroll = curPlaySong.top + playContainer.scrollTop - playContainer.clientHeight
            playContainer.scrollTop = Math.floor(scroll / 50) * 50
        }
    }, [playIndex, playListRef.current])

    useEffect(() => {
        if (playProgress > -1 && lineRef.current) {
            const lyricContainer = lyricRef.current
            lyricContainer.scrollTop = lineRef.current.offsetTop - lyricContainer.clientHeight / 2
        }
    }, [playProgress])

    const handleShowPlay = () => {
        setPlayVisible(!playVisible)
    }

    const handlePlayMode = (mode) => {
        dispatch(setPlayMode(mode))
    }

    const handleSound = () => {
        setVolumeVisble(!volumeVisible)
    }

    const handleVolume = (e) => {
        setVolume(e.target.value)
        audioRef.current.volume = e.target.value
    }

    return (
        <>
            <div className='audio-player'>
                {
                    playList.length !== 0
                        ? <div>
                            <div className='audio-info'>
                                <span><img src={SongImgURL(playList[playIndex].url, playList[playIndex].id)} alt={playList[playIndex].name} loading='lazy' /></span>
                                <div>{playList[playIndex].name}</div>
                                <div>
                                    {
                                        playList[playIndex].singers.map((singer) => (
                                            <span key={singer.id}>{singer.name}</span>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='audio-control'>
                                <div>
                                    <Button onClick={handleFastPrev}><FastBackwardOutlined /></Button>
                                    <Button onClick={handlePrev}><StepBackwardOutlined /></Button>
                                    {
                                        playing
                                            ? <Button onClick={() => { handlePlayPause(false) }}><PauseOutlined /></Button>
                                            : <Button onClick={() => { handlePlayPause(true) }}><PlayCircleOutlined /></Button>
                                    }
                                    <Button onClick={handleNext}><StepForwardOutlined /></Button>
                                    <Button onClick={handleFastNext}><FastForwardOutlined /></Button>
                                </div>
                                <input type='range'
                                    value={inputProgress}
                                    onChange={(e) => { handleInputChange(e) }}
                                    onMouseUp={(e) => { handleInputMouseUp(e) }}
                                    step='1' min='0' max={formatPlayTime(playList[playIndex].time)} />
                                <span>{formatSeconds(inputProgress)}&nbsp;/&nbsp;{formatTime(playList[playIndex].time)}</span>
                            </div>
                            <div className='audio-lyric' ref={lyricRef} >
                                {
                                    lyric && lyric.length !== 0
                                        ? <>
                                            {
                                                lyric.map((item, index, arr) => (
                                                    <div key={item.id} ref={item.seconds <= Math.floor(playProgress) ? lineRef : null}
                                                        className={
                                                            arr[index + 1]  // 有下一行
                                                                ? (
                                                                    item.seconds === Math.floor(playProgress) ||
                                                                        (item.seconds <= Math.floor(playProgress) && Math.floor(playProgress) < arr[index + 1].seconds)
                                                                        ? 'audio-lyric-line-selected' : '')
                                                                : (item.seconds <= Math.floor(playProgress) ? 'audio-lyric-line-selected' : '')
                                                        } >
                                                        {item.line}
                                                    </div>
                                                ))
                                            }
                                        </> : null
                                }
                            </div>
                            <div className='audio-list'>
                                {
                                    playList[playIndex].isLike
                                        ? <Button onClick={() => { handleFavor(playList[playIndex].id) }}><HeartFilled /></Button>
                                        : <Button onClick={() => { handleFavor(playList[playIndex].id) }}><HeartOutlined /></Button>
                                }
                                <Button onClick={() => { handleSound() }}><SoundOutlined /></Button>
                                <div className={volumeVisible ? 'audio-list-sound' : 'audio-play-null'}>
                                    <input type='range' step={0.01} min={0} max={1} value={volume} onChange={(e) => { handleVolume(e) }} />
                                </div>
                                {
                                    playMode === 1 ? <Button onClick={() => { handlePlayMode(2) }}><BarsOutlined /></Button>
                                        : playMode === 2 ? <Button onClick={() => { handlePlayMode(3) }}><RetweetOutlined /></Button>
                                            : playMode === 3 ? <Button onClick={() => { handlePlayMode(4) }}><RedoOutlined /></Button> :
                                                <Button onClick={() => { handlePlayMode(1) }}><NodeIndexOutlined /></Button>
                                }
                                <Button onClick={handleShowPlay}><MenuUnfoldOutlined /></Button>
                            </div>
                        </div> : <span>快去播放你喜欢的音乐吧</span>
                }
            </div >
            <div className={playVisible ? 'audio-play-list' : 'audio-play-null'}>
                <div>
                    <a href='#' onClick={(e) => {
                        e.preventDefault()
                        handleClear()
                    }}>清空列表</a>
                </div>
                <div ref={playListRef} >
                    {
                        playList.length !== 0
                            ? <>
                                {
                                    playList.map((play, index) => (
                                        <div key={play.id} ref={playIndex === index ? playSongRef : null}
                                            className={playIndex === index ? 'audio-play-list-item audio-play-list-item-selected' : 'audio-play-list-item'}>
                                            <span>
                                                <a href='#' onClick={(e) => {
                                                    e.preventDefault()
                                                    handleSongClick(play.id)
                                                }}>{play.name}
                                                </a>
                                                <a href='#' onClick={(e) => { e.preventDefault(); handleOnePlay(index) }}><PlayCircleOutlined /></a>
                                                {
                                                    play.isLike
                                                        ? <a href='#' onClick={(e) => { e.preventDefault(); handleFavor(play.id) }}><HeartFilled /></a>
                                                        : <a href='#' onClick={(e) => { e.preventDefault(); handleFavor(play.id) }}><HeartOutlined /></a>
                                                }
                                                <a href='#' onClick={(e) => { e.preventDefault(); handleDelete(index) }}><DeleteOutlined /></a>
                                            </span>
                                            <span>
                                                {
                                                    play.singers.map((singer) => (
                                                        <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                            {singer.name}
                                                        </a>
                                                    ))
                                                }
                                            </span>
                                            <span>{formatTime(play.time)}</span>
                                        </div>
                                    ))
                                }
                            </> : null
                    }
                </div>
            </div>
        </>
    )
}
