import React, { useEffect, useState } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import './SongDetail.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getLyric, getSongInfo } from '../../api/song';
import { Button, message } from 'antd';
import { TeamOutlined, HeartOutlined, PlusSquareOutlined, CustomerServiceOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useClickNavigate } from '../Common/Hooks/useClickNavigate';
import { formatLyric, formatPublish } from '../../utils/format';

export default function SongDetail() {

    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [songInfo, setSongInfo] = useState([])
    const [lyric, setLyric] = useState('')
    const [showAllLyric, setShowAllLyric] = useState(false)

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
        getLyric(`http://localhost:8000/media/song/${id}.txt`).then((res) => {
            if (res.status === 200) {
                setLyric(res.data)
            }
        })
    }, [location])

    const { handleSingerClick, handleAlbumClick } = useClickNavigate()

    const handleShowLyric = () => {
        setShowAllLyric(!showAllLyric)
    }

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {
                songInfo.length !== 0
                    ? <>
                        <div className='song-info'>
                            <a href='#' onClick={(e) => { e.preventDefault(e) }} >
                                <img src={`http://localhost:8000${songInfo.url}/${songInfo.id}.png`} alt={songInfo.name} loading='lazy' />
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
                                        songInfo.albums.map((album) => (
                                            <a key={album.id} href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }}>
                                                {album.name}
                                            </a>
                                        ))
                                    }
                                </div>
                                <div>发行时间：{formatPublish(songInfo.publish)}</div>
                                <div>
                                    <Button><CustomerServiceOutlined />播放</Button>
                                    <Button><HeartOutlined />我喜欢</Button>
                                    <Button><PlusSquareOutlined />收藏</Button>
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
                                            <img src={`http://localhost:8000${mv.url}/mask/${mv.id}.png`} alt={mv.name} loading='lazy' />
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
