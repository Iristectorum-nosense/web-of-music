import React, { useEffect, useState } from 'react';
import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import cookie from 'react-cookies';
import './myMusic.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';


export default function MyMusic() {

    const token = cookie.load('jwtToken')

    const navigate = useNavigate()
    const location = useLocation()
    const likePath = '/myMusic/like'
    const createPath = '/myMusic/create'
    const [select, setSelect] = useState(true)

    useEffect(() => {
        if (location.pathname.includes(likePath)) setSelect(false)
        else setSelect(true)
    }, [location])

    const handleMyLikeClick = () => {
        navigate(likePath)
    }

    const handleMyCreateClick = () => {
        navigate(createPath)
    }

    return (
        <>
            <Header></Header>
            <div className='header-wrapper'>
                {
                    token ? <>
                        <div className='mymusic-top'>
                            <a className={select ? 'mymusic-top-selected' : ''} href='#' onClick={(e) => { e.preventDefault(); handleMyCreateClick() }}>我创建的歌单</a>
                            <a className={select ? '' : 'mymusic-top-selected'} href='#' onClick={(e) => { e.preventDefault(); handleMyLikeClick() }}>我喜欢</a>
                        </div>
                        <hr />
                        <Outlet />
                    </> : <span className='mymusic-null'>登录解锁更多精彩内容</span>
                }
            </div>
            <Footer></Footer>
        </>
    )
}
