import React, { useEffect, useState } from 'react';
import { getSingerDefault } from '../../../api/singer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import './SingerDefault.scss';
import SongListComponent from '../../Common/Hooks/useSongList/useSongList';
import MVDisplay from './MVDisplay';
import AlbumDisplay from './AlbumDisplay';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';

export default function SingerDefault() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [singerDefault, setSingerDefault] = useState([])

    useEffect(() => {
        getSingerDefault(id).then((res) => {
            if (res.data.code === 405) {
                message.error(res.data.message)
                navigate('/notFound')
            }
            if (res.data.code === 200) {
                setSingerDefault(res.data.singerDefault)
            }
        }).catch(() => { })
    }, [location])

    const { handleSingerSongClick, handleSingerAlbumClick, handleSingerMVClick } = useClickNavigate()

    const SingerDefaultSongList = <SongListComponent haveOption={false} haveImg={false} haveDelete={false} haveIndex={false} data={singerDefault.songs} />
    const SingerDefaultAlbumDisplay = <AlbumDisplay data={singerDefault.albums} />
    const SingerDefaultMVDisplay = <MVDisplay data={singerDefault.mvs} />

    return (
        <>
            {
                singerDefault.length !== 0
                    ? <>
                        {
                            singerDefault.songs.length !== 0
                                ? <div className='singerdefault-song'>
                                    <div className='singerdefault-title'>
                                        <span>热门歌曲</span>
                                        <a href='#' onClick={(e) => { e.preventDefault(); handleSingerSongClick(id) }}>全部&nbsp;&gt;</a>
                                    </div>
                                    <div className='singerdefault-songList'>
                                        {SingerDefaultSongList}
                                    </div>
                                </div>
                                : <div className='singerdefault-null'>暂无歌曲~</div>
                        }
                        {
                            singerDefault.albums.length !== 0
                                ? <div className='singerdefault-album'>
                                    <div className='singerdefault-title'>
                                        <span>专辑</span>
                                        <a href='#' onClick={(e) => { e.preventDefault(); handleSingerAlbumClick(id) }}>全部&nbsp;&gt;</a>
                                    </div>
                                    {SingerDefaultAlbumDisplay}
                                </div>
                                : <div className='singerdefault-null'>暂无专辑~</div>
                        }
                        {
                            singerDefault.mvs.length !== 0
                                ? <div className='singerdefault-mv'>
                                    <div className='singerdefault-title'>
                                        <span>MV</span>
                                        <a href='#' onClick={(e) => { e.preventDefault(); handleSingerMVClick(id) }}>全部&nbsp;&gt;</a>
                                    </div>
                                    {SingerDefaultMVDisplay}
                                </div>
                                : <div className='singerdefault-null'>暂无MV~</div>
                        }
                    </>
                    : null
            }
        </>
    )
}
