import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SubNav from '../Common/Header/SubNav/SubNav';
import './AlbumDetail.scss';
import { getAlbumInfo } from '../../api/album';
import { message, Button } from 'antd';
import { TeamOutlined, HeartOutlined } from '@ant-design/icons';
import { useClickNavigate } from '../Common/Hooks/useClickNavigate';
import { formatPublish } from '../../utils/format';
import SongListComponent from '../Common/Hooks/useSongList/useSongList';
import { useSelector } from 'react-redux';
import { setLikeAlbum } from '../../api/user';

export default function AlbumDetail() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [albumInfo, setAlbumInfo] = useState([])
    const loginInfos = useSelector((state) => state.login.loginInfos)

    useEffect(() => {
        getAlbumInfo(id).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setAlbumInfo(res.data.albumInfo)
            }
        }).catch(() => { })
    }, [location])

    const { handleSingerClick } = useClickNavigate()

    const handleLikeClick = (id) => {
        let payload = {
            userId: loginInfos.userId,
            email: loginInfos.email,
            albumId: id
        }
        setLikeAlbum(payload).then((res) => {
            if (res.data.code === 200) message.success('收藏成功,请在我喜欢中查看')
            else if (res.data.code === 405) message.error(res.data.message)
            else message.error('收藏失败,请一会儿重试')
        }).catch(() => { })
    }

    const AlbumInfoSongList = <SongListComponent haveImg={false} haveDelete={false} haveIndex={false} data={albumInfo.songs} />

    return (
        <div className='header-wrapper'>
            <SubNav></SubNav>
            {
                albumInfo.length !== 0
                    ? <>
                        <div className='album-info'>
                            <a href='#' onClick={(e) => { e.preventDefault(e) }} >
                                <img src={`http://localhost:8000${albumInfo.url}/${albumInfo.id}.png`} alt={albumInfo.name} loading='lazy' />
                            </a>
                            <span className='album-info-detail'>
                                <div>{albumInfo.name}</div>
                                <div>
                                    <TeamOutlined />
                                    {
                                        albumInfo.singers.map((singer) => (
                                            <a key={singer.id} href='#' onClick={(e) => { e.preventDefault(); handleSingerClick(singer.id) }}>
                                                {singer.name}
                                            </a>
                                        ))
                                    }
                                </div>
                                <div>发行时间：{formatPublish(albumInfo.publish)}</div>
                                <div>
                                    <Button onClick={() => { handleLikeClick(albumInfo.id) }}><HeartOutlined />我喜欢</Button>
                                </div>
                            </span>
                        </div>
                        <div className='albuminfo-songList'>
                            {AlbumInfoSongList}
                        </div>
                    </>
                    : null
            }
        </div >
    )
}
