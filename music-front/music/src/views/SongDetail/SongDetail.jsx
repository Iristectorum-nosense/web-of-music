import React, { useEffect, useState } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import './SongDetail.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getLyric, getPlayListInfo, getSongInfo } from '../../api/song';
import { Button, message } from 'antd';
import { TeamOutlined, HeartOutlined, CustomerServiceOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useClickNavigate } from '../Common/Hooks/useClickNavigate';
import { formatLyric, formatPublish } from '../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { setLikeSong } from '../../api/user';
import cookie from 'react-cookies';
import { addPlaySong, setPlayIndex } from '../../store/slices/user';
import { MVImgURL, SongImgURL, SongLyricURL } from '../../utils/staticURL';

export default function SongDetail() {

    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [songInfo, setSongInfo] = useState([])
    const [lyric, setLyric] = useState('')
    const [showAllLyric, setShowAllLyric] = useState(false)
    const loginInfos = useSelector((state) => state.login.loginInfos)
    const playInfoList = useSelector((state) => state.user.playList)

    const token = cookie.load('jwtToken')

    useEffect(() => {
        getSongInfo(id).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setSongInfo(res.data.songInfo)
            }
        }).catch(() => { })
        getLyric(SongLyricURL(id)).then((res) => {
            if (res.status === 200) {
                setLyric(res.data)
            }
        })
    }, [location])

    const { handleSingerClick, handleAlbumClick } = useClickNavigate()

    const handleShowLyric = () => {
        setShowAllLyric(!showAllLyric)
    }

    const handleLikeClick = (id) => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            songId: id
        }
        setLikeSong(payload).then((res) => {
            if (res.data.code === 200) message.success('收藏成功,请在我喜欢中查看')
            else if (res.data.code === 405) message.error(res.data.message)
            else message.error('收藏失败,请一会儿重试')
        }).catch(() => { })
    }

    const handlePlayClick = (id) => {
        const playIdList = []
        playIdList.push(id)

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

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {
                songInfo.length !== 0
                    ? <>
                        <div className='song-info'>
                            <a href='#' onClick={(e) => { e.preventDefault(e) }} >
                                <img src={SongImgURL(songInfo.url, songInfo.id)} alt={songInfo.name} loading='lazy' />
                            </a>
                            <span className='song-info-detail'>
                                <div>{songInfo.name}</div>
                                <div>
                                    <TeamOutlined />
                                    {
                                        songInfo.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                {singer.name}
                                            </a>
                                        ))
                                    }
                                </div>
                                <div>
                                    专辑：
                                    {
                                        songInfo.albums.length !== 0
                                            ? (
                                                songInfo.albums.map((album) => (
                                                    <a key={album.id} href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }}>
                                                        {album.name}
                                                    </a>
                                                ))
                                            ) : '暂无'
                                    }
                                </div>
                                <div>发行时间：{formatPublish(songInfo.publish)}</div>
                                <div>
                                    <Button onClick={() => { handlePlayClick(songInfo.id) }}><CustomerServiceOutlined />播放</Button>
                                    {
                                        token ? <Button onClick={() => { handleLikeClick(songInfo.id) }}><HeartOutlined />我喜欢</Button> : null
                                    }
                                </div>
                            </span>
                        </div>
                        <div className='song-content'>
                            <div className='song-content-lyric'>
                                <div>歌词</div>
                                <div className={showAllLyric ? '' : 'song-content-lyric-part'}>
                                    {
                                        formatLyric(lyric).split('\n').map((line, index) => (
                                            <div key={index}>
                                                {line}
                                            </div>
                                        ))
                                    }
                                </div>
                                <Button size='small' onClick={handleShowLyric}>{showAllLyric ? '收起' : '展开'}</Button>
                            </div>
                            {
                                songInfo.mv.map((mv) => (
                                    <div key={mv.id} className='song-content-mv'>
                                        <a href='#' onClick={(e) => { e.preventDefault(); }} >
                                            <img src={MVImgURL(mv.url, mv.id)} alt={mv.name} loading='lazy' />
                                            <span className='mask'><PlayCircleOutlined /></span>
                                        </a>
                                        <div><a>{mv.name}</a></div>
                                        <div>
                                            {
                                                mv.singers.map((singer) => (
                                                    <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                        {singer.name}
                                                    </a>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                    : null
            }
        </div>
    )
}
