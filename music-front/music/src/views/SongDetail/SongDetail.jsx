import React, { useEffect, useState } from 'react';
import SubNav from '../Common/Header/SubNav/SubNav';
import './SongDetail.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getSongInfo } from '../../api/song';
import { message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useClickNavigate } from '../Common/Hooks/useClickNavigate';
import { formatPublish } from '../../utils/format';

export default function SongDetail() {

    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [songInfo, setSongInfo] = useState([])

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
    }, [location])

    const { handleSingerClick } = useClickNavigate()

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
                                <div>发行时间：{formatPublish(songInfo.publish)}</div>
                            </span>
                        </div>
                        {/* <div className='album-info'>
                            <span className='album-info-detail'>
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
                                <div>发行时间：{formatPublish(songInfo.publish)}</div>
                                <div>
                                    <Button><HeartOutlined />我喜欢</Button>
                                </div>
                            </span>
                        </div> */}
                    </>
                    : null
            }
        </div>
    )
}
