import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './MyMusicLike.scss';

export default function MyMusicLike() {

    const navigate = useNavigate()
    const location = useLocation()
    const songPath = '/myMusic/like/song'
    const albumPath = '/myMusic/like/album'
    const mvPath = '/myMusic/like/mv'
    const [select, setSelect] = useState(1)

    useEffect(() => {
        if (location.pathname.includes(albumPath)) setSelect(2)
        else if (location.pathname.includes(mvPath)) setSelect(3)
        else setSelect(1)
    }, [location])

    const handleLikeClick = (index) => {
        switch (index) {
            case 1: navigate(songPath); break
            case 2: navigate(albumPath); break
            case 3: navigate(mvPath); break
            default: break
        }
    }

    return (
        <>
            <div className='mymusic-sub'>
                <a className={select === 1 ? 'mymusic-sub-selected' : ''} href='#' onClick={(e) => { e.preventDefault(); handleLikeClick(1) }}>单曲</a>
                <a className={select === 2 ? 'mymusic-sub-selected' : ''} href='#' onClick={(e) => { e.preventDefault(); handleLikeClick(2) }}>专辑</a>
                <a className={select === 3 ? 'mymusic-sub-selected' : ''} href='#' onClick={(e) => { e.preventDefault(); handleLikeClick(3) }}>MV</a>
            </div>
            <Outlet />
        </>
    )
}
