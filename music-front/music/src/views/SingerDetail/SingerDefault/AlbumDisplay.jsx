import React from 'react';
import { formatPublish } from '../../../utils/format';
import { useClickNavigate } from '../../Common/Hooks/useClickNavigate';
import { AlbumImgURL } from '../../../utils/staticURL';

export default function AlbumDisplay({ data }) {

    const { handleAlbumClick } = useClickNavigate()

    return (
        <>
            <div className='singerdefault-albumList'>
                {
                    data.map((album) => (
                        <div key={album.id} className='singerdefault-albumList-item'>
                            <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }} >
                                <img src={AlbumImgURL(album.url, album.id)} alt={album.name} loading='lazy' />
                            </a>
                            <div>
                                <a href='#' onClick={(e) => { e.preventDefault(); handleAlbumClick(album.id) }}>{album.name}</a>
                            </div>
                            <div>{formatPublish(album.publish)}</div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
