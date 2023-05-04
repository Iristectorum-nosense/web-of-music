import React from 'react';
import { formatPublish } from '../../../utils/format';

export default function AlbumDisplay({ data }) {
    return (
        <>
            <div className='singerdefault-albumList'>
                {
                    data.map((album) => (
                        <div key={album.id} className='singerdefault-albumList-item'>
                            <a href='#' onClick={(e) => { e.preventDefault(); }} >
                                <img src={`http://localhost:8000${album.url}/${album.id}.png`} alt={album.name} loading='lazy' />
                            </a>
                            <div><a>{album.name}</a></div>
                            <div>{formatPublish(album.publish)}</div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
