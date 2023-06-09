import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SubNav from '../Common/Header/SubNav/SubNav';
import { useNavigate, useParams } from 'react-router-dom';
import { getSingerInfo } from '../../api/singer';
import { Button, message } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import './SingerDetail.scss';
import { useClickNavigate } from '../Common/Hooks/useClickNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { playSingerSongAction } from '../../store/slices/user';
import { SingerImgURL } from '../../utils/staticURL';

export default function SingerDetail() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [singerInfo, setSingerInfo] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        getSingerInfo(id).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setSingerInfo(res.data.singerInfo)
            }
        }).catch(() => { })
    }, [location])

    const { handleSingerClick, handleSingerSongClick, handleSingerAlbumClick, handleSingerMVClick } = useClickNavigate()

    const handlePlayClick = () => {
        dispatch(playSingerSongAction(id))
    }

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            <div className='singer-info'>
                <a href='#' onClick={(e) => { e.preventDefault(e); handleSingerClick(id) }} >
                    <img src={SingerImgURL(singerInfo.url, singerInfo.id)} alt={singerInfo.name} loading='lazy' />
                </a>
                <span className='singer-info-detail'>
                    <div>{singerInfo.name}</div>
                    <div>简介：{singerInfo.desc}</div>
                    <div>
                        <a href='#' onClick={(e) => { e.preventDefault(); handleSingerSongClick(id) }}>单曲&nbsp;{singerInfo.songCount}</a>
                        <span>|</span>
                        <a href='#' onClick={(e) => { e.preventDefault(); handleSingerAlbumClick(id) }}>专辑&nbsp;{singerInfo.albumCount}</a>
                        <span>|</span>
                        <a href='#' onClick={(e) => { e.preventDefault(); handleSingerMVClick(id) }}>MV&nbsp;{singerInfo.mvCount}</a>
                    </div>
                    <div>
                        {
                            singerInfo.count === 0 ? null
                                : <Button onClick={handlePlayClick}><CustomerServiceOutlined />播放歌手热门歌曲</Button>
                        }
                    </div>
                </span>
            </div>
            <Outlet />
        </div>
    )
}
