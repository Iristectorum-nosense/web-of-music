import React from 'react';
import './HomeAlbum.scss';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';

export default function HomeAlbumComponent({ data = [], index = 1 }) {

    const showData = data.slice((index - 1) * 4, index * 4)
    const { handleAlbumClick, handleSingerClick } = useClickNavigate()

    return (
        <div className='home-album'>
            {
                showData.map((album) => (
                    <div key={album.id} className='home-album-item'>
                        <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }} >
                            <img src={`http://localhost:8000${album.url}/${album.id}.png`} alt={album.name} loading='lazy' />
                        </a>
                        <div>
                            <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }}>{album.name}</a>
                        </div>
                        <div>
                            {
                                album.singers.map((singer) => (
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
    )
}
